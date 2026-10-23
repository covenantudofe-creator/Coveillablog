const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createHash, randomBytes } = require("crypto");
const { Op } = require("sequelize");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");
const passwordResetEmail = require("../emails/passwordReset");
const { ownerLoginEmail, userLoginEmail } = require("../emails/loginNotification");

const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;
const PASSWORD_RESET_RESPONSE = "If an account can be recovered with this email, a reset link will be sent.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizedEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(email) {
  return email.length <= 320 && EMAIL_PATTERN.test(email);
}

function passwordByteLength(password) {
  return Buffer.byteLength(password, "utf8");
}

function isValidPassword(password) {
  const byteLength = passwordByteLength(password);
  return byteLength >= 12 && byteLength <= 72;
}

function hashResetToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

async function verifyGoogleIdToken(credential, clientId) {
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
  return ticket.getPayload();
}

function isUniqueConstraintError(error) {
  return error?.name === "SequelizeUniqueConstraintError" || error?.original?.code === "23505";
}

function queueLoginNotifications({ email, method, sendEmailFn, ownerEmail, frontendUrl }) {
  const event = { email, method, occurredAt: new Date().toISOString() };
  try {
    event.resetUrl = frontendUrl ? new URL("/sign-in", frontendUrl).toString() : null;
  } catch {
    event.resetUrl = null;
  }

  const notifications = [];
  if (ownerEmail) notifications.push({ audience: "owner", recipient: ownerEmail, subject: "New Login to Coveilla Blog", html: ownerLoginEmail(event) });
  else console.warn("Login owner notification skipped (OWNER_EMAIL is not configured).");
  if (email) notifications.push({ audience: "reader", recipient: email, subject: "New Login to Your Coveilla Account", html: userLoginEmail(event) });
  for (const { audience, recipient, subject, html } of notifications) {
    console.info(`Login notification attempted (audience=${audience}).`);
    try {
      Promise.resolve(sendEmailFn(recipient, subject, html, {
        notificationType: "login",
        audience,
      })).catch((error) => {
        const reason = error?.code || error?.name || "UnknownError";
        console.error(`Login notification sender rejected (audience=${audience}; reason=${reason}).`);
      });
    } catch (error) {
      const reason = error?.code || error?.name || "UnknownError";
      console.error(`Login notification sender rejected (audience=${audience}; reason=${reason}).`);
    }
  }
}

function createAuthRouter({
  UserModel = User,
  verifyGoogle = verifyGoogleIdToken,
  sendEmailFn = sendEmail,
  ownerEmail = process.env.OWNER_EMAIL,
  frontendUrl = process.env.FRONTEND_URL?.split(",")[0].trim(),
  jwtSecret = process.env.JWT_SECRET,
  adminUsername = process.env.ADMIN_USERNAME,
  adminPasswordHash = process.env.ADMIN_PASSWORD_HASH,
} = {}) {
  const router = express.Router();

  router.post("/reader/register", async (req, res) => {
    const { name, email: suppliedEmail, password } = req.body || {};
    const email = normalizedEmail(suppliedEmail);
    const cleanName = typeof name === "string" ? name.trim() : "";

    if (!cleanName || cleanName.length > 255 || !isValidEmail(email)) {
      return res.status(400).json({ message: "Enter your name and a valid email address." });
    }
    if (typeof password !== "string" || !isValidPassword(password)) {
      return res.status(400).json({ message: "Choose a password between 12 and 72 bytes." });
    }
    if (!jwtSecret) {
      return res.status(503).json({ message: "Reader registration is not configured." });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await UserModel.create({
        googleSub: null,
        email,
        name: cleanName,
        passwordHash,
      });
      return res.status(201).json({
        message: "Your account was created. You can now log in.",
        user: { id: user.id, name: user.name, email: user.email, role: "reader" },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        return res.status(409).json({
          message: "An account with this email already exists. Log in with that account's original method.",
        });
      }
      console.error("Reader registration failed:", error.name || "UnknownError");
      return res.status(500).json({ message: "Account creation could not be completed. Please try again." });
    }
  });

  router.post("/reader/login", async (req, res) => {
    const email = normalizedEmail(req.body?.email);
    const { password } = req.body || {};
    if (!isValidEmail(email) || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Enter a valid email address and password." });
    }
    if (!jwtSecret) {
      return res.status(503).json({ message: "Reader sign-in is not configured." });
    }

    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
      const token = jwt.sign(
        { sub: String(user.id), role: "reader" },
        jwtSecret,
        { expiresIn: "1h", algorithm: "HS256" }
      );
      queueLoginNotifications({ email: user.email, method: "Email/password", sendEmailFn, ownerEmail, frontendUrl });
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, picture: user.picture, role: "reader" },
      });
    } catch (error) {
      console.error("Reader sign-in failed:", error.name || "UnknownError");
      return res.status(500).json({ message: "Sign-in could not be completed. Please try again." });
    }
  });

  router.post("/forgot-password", async (req, res) => {
    const email = normalizedEmail(req.body?.email);
    if (!isValidEmail(email)) return res.status(202).json({ message: PASSWORD_RESET_RESPONSE });

    try {
      const user = await UserModel.findOne({ where: { email } });
      if (user?.passwordHash) {
        const rawToken = randomBytes(32).toString("hex");
        const tokenHash = hashResetToken(rawToken);
        try {
          if (!frontendUrl) throw new Error("Frontend URL is not configured");
          const resetUrl = new URL("/reset-password", frontendUrl);
          resetUrl.hash = new URLSearchParams({ token: rawToken }).toString();
          await user.update({
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
          });
          await sendEmailFn(user.email, "Reset your Coveilla password", passwordResetEmail(resetUrl.toString()));
        } catch (error) {
          await user.update({ resetPasswordTokenHash: null, resetPasswordExpiresAt: null }).catch(() => {});
          console.error("Password reset email could not be sent:", error.name || "UnknownError");
        }
      }
      return res.status(202).json({ message: PASSWORD_RESET_RESPONSE });
    } catch (error) {
      console.error("Password recovery request failed:", error.name || "UnknownError");
      return res.status(500).json({ message: "Password recovery could not be processed. Please try again." });
    }
  });

  router.post("/reset-password", async (req, res) => {
    const { token, password } = req.body || {};
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({ message: "This reset link is invalid or has expired." });
    }
    if (typeof password !== "string" || !isValidPassword(password)) {
      return res.status(400).json({ message: "Choose a password between 12 and 72 bytes." });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const [updatedCount] = await UserModel.update({
        passwordHash,
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
      }, {
        where: {
          resetPasswordTokenHash: hashResetToken(token),
          resetPasswordExpiresAt: { [Op.gt]: new Date() },
        },
      });
      if (!updatedCount) {
        return res.status(400).json({ message: "This reset link is invalid or has expired." });
      }
      return res.json({ message: "Your password has been updated. You can now log in." });
    } catch (error) {
      console.error("Password reset failed:", error.name || "UnknownError");
      return res.status(500).json({ message: "Password reset could not be completed. Please request a new link." });
    }
  });

  router.post("/google", async (req, res) => {
    const { credential } = req.body || {};
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (typeof credential !== "string" || !credential) {
      return res.status(400).json({ message: "A Google credential is required." });
    }
    if (!clientId || !jwtSecret) {
      return res.status(503).json({ message: "Google sign-in is not configured." });
    }

    try {
      let profile;
      try {
        profile = await verifyGoogle(credential, clientId);
      } catch {
        return res.status(401).json({ message: "Google sign-in expired or could not be verified. Please try again." });
      }
      const issuerIsValid = ["https://accounts.google.com", "accounts.google.com"].includes(profile?.iss);
      if (!profile?.sub || !profile?.email || profile.email_verified !== true || !issuerIsValid) {
        return res.status(401).json({ message: "Google did not provide a verified account." });
      }

      const email = profile.email.trim().toLowerCase();
      let user = await UserModel.findOne({ where: { googleSub: profile.sub } });

      if (user) {
        const conflictingEmail = await UserModel.findOne({ where: { email } });
        if (conflictingEmail && String(conflictingEmail.id) !== String(user.id)) {
          return res.status(409).json({
            message: "That email is already associated with another account. Sign in using that account’s original method.",
          });
        }
        await user.update({
          email,
          name: profile.name || user.name,
          picture: profile.picture || null,
        });
      } else {
        const existingEmail = await UserModel.findOne({ where: { email } });
        if (existingEmail) {
          return res.status(409).json({
            message: "An account with this email already exists. Sign in using that account’s original method; accounts are not automatically linked.",
          });
        }

        try {
          user = await UserModel.create({
            googleSub: profile.sub,
            email,
            name: profile.name || email.split("@")[0],
            picture: profile.picture || null,
          });
        } catch (error) {
          if (!isUniqueConstraintError(error)) throw error;

          // A concurrent request may have created this Google subject first.
          user = await UserModel.findOne({ where: { googleSub: profile.sub } });
          if (!user) {
            return res.status(409).json({
              message: "An account with this email already exists. Sign in using that account’s original method; accounts are not automatically linked.",
            });
          }
        }
      }

      const token = jwt.sign(
        { sub: String(user.id), role: "reader" },
        jwtSecret,
        { expiresIn: "1h", algorithm: "HS256" }
      );
      queueLoginNotifications({ email: user.email, method: "Google", sendEmailFn, ownerEmail, frontendUrl });
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, picture: user.picture, role: "reader" },
      });
    } catch (error) {
      console.error("Google sign-in failed:", error.name || "UnknownError");
      return res.status(500).json({ message: "Google sign-in could not be completed. Please try again." });
    }
  });

  router.post("/login", async (req, res) => {
    const { username, password } = req.body || {};
    if (!jwtSecret || !adminUsername || !adminPasswordHash) {
      return res.status(503).json({ message: "Admin sign-in is not configured." });
    }
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Username and password are required." });
    }

    try {
      const isMatch = username === adminUsername && await bcrypt.compare(password, adminPasswordHash);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

      const token = jwt.sign(
        { sub: `admin:${adminUsername}`, username: adminUsername, role: "admin" },
        jwtSecret,
        { expiresIn: "1h", algorithm: "HS256" }
      );
      queueLoginNotifications({ email: null, method: "Administrator username/password", sendEmailFn, ownerEmail, frontendUrl });
      return res.json({ token, user: { username: adminUsername, role: "admin" } });
    } catch {
      return res.status(500).json({ message: "Admin sign-in could not be completed." });
    }
  });

  router.get("/me", authenticateToken, async (req, res) => {
    if (req.user.role === "admin") {
      return res.json({ user: { username: req.user.username, role: "admin" } });
    }
    if (req.user.role !== "reader") {
      return res.status(403).json({ message: "This account type is not supported." });
    }

    try {
      const user = await UserModel.findByPk(req.user.sub);
      if (!user) return res.status(401).json({ message: "This account is no longer available." });
      return res.json({
        user: { id: user.id, name: user.name, email: user.email, picture: user.picture, role: "reader" },
      });
    } catch {
      return res.status(500).json({ message: "Could not load your account." });
    }
  });

  return router;
}

module.exports = createAuthRouter();
module.exports.createAuthRouter = createAuthRouter;
module.exports.verifyGoogleIdToken = verifyGoogleIdToken;
