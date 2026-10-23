const express = require("express");
const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");
const visitorEmail = require("../emails/visitorEmail");
const ownerEmail = require("../emails/ownerEmail");
const { authenticateToken, requireRole } = require("../middleware/auth");

function createContactRouter({
  ContactModel = Contact,
  sendEmailFn = sendEmail,
  visitorEmailTemplate = visitorEmail,
  ownerEmailTemplate = ownerEmail,
} = {}) {
  const router = express.Router();

  // Public contact form submission.
  router.post("/", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body || {};
      if (![name, email, subject, message].every((value) => typeof value === "string" && value.trim())) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }

      const cleanName = name.trim();
      const cleanEmail = email.trim();
      const cleanSubject = subject.trim();
      const cleanMessage = message.trim();
      const savedMessage = await ContactModel.create({
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
      });

      await sendEmailFn(cleanEmail, "Your story has reached us | Coveilla Blog", visitorEmailTemplate(cleanName));
      if (process.env.OWNER_EMAIL) {
        await sendEmailFn(
          process.env.OWNER_EMAIL,
          `New Contact: ${cleanSubject}`,
          ownerEmailTemplate(cleanName, cleanEmail, cleanSubject, cleanMessage)
        );
      }

      return res.status(201).json({ success: true, message: "Message sent successfully.", data: savedMessage });
    } catch (error) {
      console.error("Contact route failed:", error.name || "UnknownError");
      return res.status(500).json({ success: false, message: "Server error while sending message." });
    }
  });

  // Contact messages contain personal data and are admin-only.
  router.get("/", authenticateToken, requireRole("admin"), async (req, res) => {
    try {
      const messages = await ContactModel.findAll({ order: [["createdAt", "DESC"]] });
      return res.status(200).json({ success: true, data: messages });
    } catch {
      return res.status(500).json({ success: false, message: "Unable to fetch messages." });
    }
  });

  router.delete("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
    try {
      const message = await ContactModel.findByPk(req.params.id);
      if (!message) return res.status(404).json({ success: false, message: "Message not found." });
      await message.destroy();
      return res.status(200).json({ success: true, message: "Message deleted successfully." });
    } catch {
      return res.status(500).json({ success: false, message: "Unable to delete message." });
    }
  });

  return router;
}

module.exports = createContactRouter();
module.exports.createContactRouter = createContactRouter;
