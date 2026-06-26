const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

const visitorEmail = require("../emails/visitorEmail");
const ownerEmail = require("../emails/ownerEmail");

// =========================
// CREATE NEW CONTACT MESSAGE
// POST /api/contact
// =========================
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Save message to database
    const newMessage = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Send confirmation email to visitor
    await sendEmail(
      email,
      "🎬 Your story has reached us | Coveilla Blog",
      visitorEmail(name)
    );

    // Notify site owner
    await sendEmail(
      process.env.EMAIL_USER,
      `🎬 New Story Received • ${subject}`,
      ownerEmail(name, email, subject, message)
    );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully 💌",
      data: newMessage,
    });

  } catch (error) {
    console.error("CONTACT POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while sending message",
      error: error.message,
    });
  }
});

// =========================
// GET ALL CONTACT MESSAGES
// GET /api/contact
// =========================
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: messages,
    });

  } catch (error) {
    console.error("CONTACT GET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching messages",
      error: error.message,
    });
  }
});

// =========================
// DELETE CONTACT MESSAGE
// DELETE /api/contact/:id
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Contact.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    await message.destroy();

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });

  } catch (error) {
    console.error("CONTACT DELETE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting message",
      error: error.message,
    });
  }
});

module.exports = router;