const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const request = require("supertest");

process.env.DATABASE_URL ||= "postgres://test:test@127.0.0.1:5432/coveilla_test";
process.env.JWT_SECRET = "test-only-coveilla-auth-secret";
process.env.GOOGLE_CLIENT_ID = "coveilla-test-client-id";

const { createAuthRouter } = require("../routes/auth");
const sequelize = require("../database/db");
after(() => sequelize.close());

function createUserStore() {
  const users = [];
  return {
    users,
    async findOne({ where }) {
      return users.find((user) => Object.entries(where).every(([key, value]) => user[key] === value)) || null;
    },
    async findByPk(id) { return users.find((user) => String(user.id) === String(id)) || null; },
    async create(values) {
      await new Promise((resolve) => setImmediate(resolve));
      if (users.some((user) => (values.googleSub && user.googleSub === values.googleSub) || user.email === values.email)) {
        const error = new Error("Unique constraint");
        error.name = "SequelizeUniqueConstraintError";
        error.original = { code: "23505" };
        throw error;
      }
      const user = {
        id: users.length + 1,
        ...values,
        async update(next) { Object.assign(this, next); return this; },
      };
      users.push(user);
      return user;
    },
    async update(values, { where }) {
      const user = users.find((entry) => entry.resetPasswordTokenHash === where.resetPasswordTokenHash
        && entry.resetPasswordExpiresAt > where.resetPasswordExpiresAt[Op.gt]);
      if (!user) return [0];
      Object.assign(user, values);
      return [1];
    },
  };
}

function createApp(userStore, options = {}) {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", createAuthRouter({
    UserModel: userStore,
    verifyGoogle: options.verifyGoogle || (async () => options.profile),
    jwtSecret: process.env.JWT_SECRET,
    adminUsername: "site-admin",
    adminPasswordHash: options.adminPasswordHash,
    frontendUrl: "https://coveilla.example",
    ownerEmail: options.ownerEmail === undefined ? "owner@example.com" : options.ownerEmail,
    sendEmailFn: options.sendEmailFn || (async () => {}),
  }));
  return app;
}

const verifiedProfile = {
  sub: "google-sub-123",
  email: "Reader@Example.com",
  email_verified: true,
  name: "Coveilla Reader",
  picture: "https://example.com/profile.png",
  iss: "https://accounts.google.com",
};

test("Google sign-in creates a normalized reader account and a reader-only JWT", async () => {
  const store = createUserStore();
  const response = await request(createApp(store, { profile: verifiedProfile }))
    .post("/api/auth/google").send({ credential: "valid-google-id-token" }).expect(200);

  assert.equal(store.users.length, 1);
  assert.equal(store.users[0].email, "reader@example.com");
  assert.equal(response.body.user.role, "reader");
  assert.equal(jwt.verify(response.body.token, process.env.JWT_SECRET).role, "reader");
});

test("repeat Google sign-in retrieves the existing account", async () => {
  const store = createUserStore();
  const app = createApp(store, { profile: verifiedProfile });
  const first = await request(app).post("/api/auth/google").send({ credential: "token" }).expect(200);
  const second = await request(app).post("/api/auth/google").send({ credential: "token" }).expect(200);
  assert.equal(store.users.length, 1);
  assert.equal(second.body.user.id, first.body.user.id);
});

test("simultaneous registration for the same Google subject resolves to one reader", async () => {
  const store = createUserStore();
  const app = createApp(store, { profile: verifiedProfile });
  const results = await Promise.all([
    request(app).post("/api/auth/google").send({ credential: "token" }),
    request(app).post("/api/auth/google").send({ credential: "token" }),
  ]);
  assert.deepEqual(results.map((response) => response.status), [200, 200]);
  assert.equal(store.users.length, 1);
  assert.equal(results[0].body.user.id, results[1].body.user.id);
});

test("email collision does not link a Google account to an existing account", async () => {
  const store = createUserStore();
  store.users.push({ id: 9, email: "reader@example.com", googleSub: null, name: "Existing account" });
  const response = await request(createApp(store, { profile: verifiedProfile }))
    .post("/api/auth/google").send({ credential: "token" }).expect(409);
  assert.match(response.body.message, /not automatically linked/i);
  assert.equal(store.users.length, 1);
});

test("unverified Google email is rejected", async () => {
  const store = createUserStore();
  const sent = [];
  await request(createApp(store, {
    profile: { ...verifiedProfile, email_verified: false },
    sendEmailFn: (...args) => { sent.push(args); },
  })).post("/api/auth/google").send({ credential: "token" }).expect(401);
  assert.equal(store.users.length, 0);
  assert.equal(sent.length, 0);
});

test("admin password login issues an admin token only through the admin route", async () => {
  const passwordHash = await bcrypt.hash("test-password", 4);
  const sent = [];
  const response = await request(createApp(createUserStore(), {
    adminPasswordHash: passwordHash,
    sendEmailFn: (...args) => { sent.push(args); },
  }))
    .post("/api/auth/login").send({ username: "site-admin", password: "test-password" }).expect(200);
  assert.equal(response.body.user.role, "admin");
  assert.equal(jwt.verify(response.body.token, process.env.JWT_SECRET).role, "admin");
  assert.equal(sent.length, 1);
  assert.equal(sent[0][0], "owner@example.com");
  assert.equal(sent[0][1], "New Login to Coveilla Blog");
  assert.match(sent[0][2], /Administrator username\/password/);
});

test("admin password login rejects an incorrect password", async () => {
  const passwordHash = await bcrypt.hash("test-password", 4);
  const sent = [];
  const response = await request(createApp(createUserStore(), {
    adminPasswordHash: passwordHash,
    sendEmailFn: (...args) => { sent.push(args); },
  }))
    .post("/api/auth/login").send({ username: "site-admin", password: "incorrect-password" }).expect(401);
  assert.equal(response.body.message, "Invalid credentials.");
  assert.equal(sent.length, 0);
});

test("reader registration hashes passwords and rejects duplicate emails", async () => {
  const store = createUserStore();
  const app = createApp(store);
  const response = await request(app).post("/api/auth/reader/register")
    .send({ name: "A Reader", email: "Reader@Example.com", password: "secure-password-123" }).expect(201);
  assert.equal(response.body.user.email, "reader@example.com");
  assert.equal(response.body.user.role, "reader");
  assert.equal("token" in response.body, false);
  assert.notEqual(store.users[0].passwordHash, "secure-password-123");
  assert.equal(await bcrypt.compare("secure-password-123", store.users[0].passwordHash), true);
  await request(app).post("/api/auth/reader/register")
    .send({ name: "Another", email: "reader@example.com", password: "secure-password-456" }).expect(409);
});

test("reader password length limits count UTF-8 bytes consistently with bcrypt", async () => {
  const app = createApp(createUserStore());
  await request(app).post("/api/auth/reader/register")
    .send({ name: "Short Password", email: "short@example.com", password: "12345678901" }).expect(400);
  await request(app).post("/api/auth/reader/register")
    .send({ name: "Boundary Password", email: "boundary@example.com", password: "123456789012" }).expect(201);
  await request(app).post("/api/auth/reader/register")
    .send({ name: "Unicode Boundary", email: "unicode@example.com", password: "😀".repeat(18) }).expect(201);
  await request(app).post("/api/auth/reader/register")
    .send({ name: "Too Long Unicode", email: "toolong@example.com", password: "😀".repeat(19) }).expect(400);
});

test("reader login issues a reader session and rejects incorrect credentials", async () => {
  const store = createUserStore();
  const app = createApp(store);
  await request(app).post("/api/auth/reader/register")
    .send({ name: "A Reader", email: "reader@example.com", password: "secure-password-123" }).expect(201);
  const response = await request(app).post("/api/auth/reader/login")
    .send({ email: "READER@example.com", password: "secure-password-123" }).expect(200);
  assert.equal(response.body.user.role, "reader");
  assert.equal(jwt.verify(response.body.token, process.env.JWT_SECRET).role, "reader");
  await request(app).post("/api/auth/reader/login")
    .send({ email: "reader@example.com", password: "wrong-password" }).expect(401);
  await request(app).post("/api/auth/reader/login")
    .send({ email: "missing@example.com", password: "secure-password-123" }).expect(401);
});

test("successful email/password login notifies the owner and reader exactly once", async () => {
  const store = createUserStore();
  const sent = [];
  const app = createApp(store, { sendEmailFn: (...args) => { sent.push(args); } });
  await request(app).post("/api/auth/reader/register")
    .send({ name: "A Reader", email: "reader@example.com", password: "private-password-123" }).expect(201);
  const response = await request(app).post("/api/auth/reader/login")
    .send({ email: "reader@example.com", password: "private-password-123" }).expect(200);
  assert.equal(sent.length, 2);
  assert.deepEqual(sent.map(([recipient, subject]) => [recipient, subject]), [
    ["owner@example.com", "New Login to Coveilla Blog"],
    ["reader@example.com", "New Login to Your Coveilla Account"],
  ]);
  assert.match(sent[0][2], /reader@example\.com/);
  assert.match(sent[0][2], /Email\/password/);
  assert.match(sent[0][2], /UTC/);
  assert.match(sent[1][2], /Open password recovery/);
  for (const [, , html] of sent) {
    assert.doesNotMatch(html, /private-password-123/);
    assert.doesNotMatch(html, new RegExp(response.body.token));
  }
  await request(app).get("/api/auth/me").set("Authorization", `Bearer ${response.body.token}`).expect(200);
  assert.equal(sent.length, 2);
});

test("failed email/password login sends no login notifications", async () => {
  const store = createUserStore();
  const sent = [];
  const app = createApp(store, { sendEmailFn: (...args) => { sent.push(args); } });
  store.users.push({
    id: 4,
    email: "reader@example.com",
    name: "A Reader",
    googleSub: null,
    passwordHash: await bcrypt.hash("private-password-123", 4),
  });
  await request(app).post("/api/auth/reader/login")
    .send({ email: "reader@example.com", password: "incorrect-password" }).expect(401);
  assert.equal(sent.length, 0);
});

test("successful Google login notifies the owner and reader once with the Google method", async () => {
  const sent = [];
  const app = createApp(createUserStore(), {
    profile: verifiedProfile,
    sendEmailFn: (...args) => { sent.push(args); },
  });
  await request(app).post("/api/auth/google").send({ credential: "token" }).expect(200);
  assert.equal(sent.length, 2);
  assert.deepEqual(sent.map(([recipient, subject]) => [recipient, subject]), [
    ["owner@example.com", "New Login to Coveilla Blog"],
    ["reader@example.com", "New Login to Your Coveilla Account"],
  ]);
  assert.ok(sent.every(([, , html]) => html.includes("Google")));
});

test("login still succeeds and notifies the reader when OWNER_EMAIL is not configured", async () => {
  const store = createUserStore();
  const sent = [];
  const app = createApp(store, { ownerEmail: "", sendEmailFn: (...args) => { sent.push(args); } });
  await request(app).post("/api/auth/reader/register")
    .send({ name: "A Reader", email: "reader@example.com", password: "secure-password-123" }).expect(201);
  await request(app).post("/api/auth/reader/login")
    .send({ email: "reader@example.com", password: "secure-password-123" }).expect(200);
  assert.equal(sent.length, 1);
  assert.equal(sent[0][0], "reader@example.com");
});

test("email delivery failures do not fail a successful login", async () => {
  const store = createUserStore();
  const app = createApp(store, {
    sendEmailFn: (to) => {
      if (to === "owner@example.com") throw new Error("owner delivery failed");
      return Promise.reject(new Error("reader delivery failed"));
    },
  });
  await request(app).post("/api/auth/reader/register")
    .send({ name: "A Reader", email: "reader@example.com", password: "secure-password-123" }).expect(201);
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    await request(app).post("/api/auth/reader/login")
      .send({ email: "reader@example.com", password: "secure-password-123" }).expect(200);
    await new Promise((resolve) => setImmediate(resolve));
  } finally {
    console.error = originalConsoleError;
  }
});

test("password recovery is neutral and reset tokens are hashed, expiring, and single-use", async () => {
  const store = createUserStore();
  const sent = [];
  const app = createApp(store, { sendEmailFn: async (...args) => sent.push(args) });
  await request(app).post("/api/auth/reader/register")
    .send({ name: "A Reader", email: "reader@example.com", password: "secure-password-123" }).expect(201);
  const known = await request(app).post("/api/auth/forgot-password").send({ email: "reader@example.com" }).expect(202);
  const unknown = await request(app).post("/api/auth/forgot-password").send({ email: "missing@example.com" }).expect(202);
  assert.equal(known.body.message, unknown.body.message);
  assert.equal(sent.length, 1);
  const rawToken = sent[0][2].match(/#token=([a-f0-9]{64})/)[1];
  const reader = store.users[0];
  assert.notEqual(reader.resetPasswordTokenHash, rawToken);
  assert.ok(reader.resetPasswordExpiresAt > new Date());
  await request(app).post("/api/auth/reset-password")
    .send({ token: rawToken, password: "new-secure-password-456" }).expect(200);
  assert.equal(reader.resetPasswordTokenHash, null);
  await request(app).post("/api/auth/reset-password")
    .send({ token: rawToken, password: "another-secure-password" }).expect(400);
  await request(app).post("/api/auth/reader/login")
    .send({ email: "reader@example.com", password: "new-secure-password-456" }).expect(200);

  const expiredToken = "a".repeat(64);
  reader.resetPasswordTokenHash = require("crypto").createHash("sha256").update(expiredToken).digest("hex");
  reader.resetPasswordExpiresAt = new Date(Date.now() - 1000);
  await request(app).post("/api/auth/reset-password")
    .send({ token: expiredToken, password: "another-secure-password" }).expect(400);
});

test("Google-only accounts receive no password-reset email from the neutral recovery response", async () => {
  const store = createUserStore();
  const sent = [];
  const app = createApp(store, { profile: verifiedProfile, sendEmailFn: (...args) => { sent.push(args); } });
  await request(app).post("/api/auth/google").send({ credential: "token" }).expect(200);
  assert.equal(sent.length, 2);
  sent.length = 0;
  await request(app).post("/api/auth/forgot-password").send({ email: "reader@example.com" }).expect(202);
  assert.equal(sent.length, 0);
});
