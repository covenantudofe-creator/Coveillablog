const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

const visitorEmail = require("../emails/visitorEmail");
const ownerEmail = require("../emails/ownerEmail");

/* =====================================================
   CREATE CONTACT MESSAGE
   POST /api/contact
===================================================== */

router.post("/", async (req, res) => {
  try {
    console.log("📩 Incoming Contact Request");
    console.log(req.body);

    const { name, email, subject, message } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Save to database
    const savedMessage = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    console.log("✅ Message saved to SQLite");

    // Send confirmation email
    await sendEmail(
      email.trim(),
      "🎬 Your story has reached us | Coveilla Blog",
      visitorEmail(name.trim())
    );

    console.log("✅ Visitor email sent");

    // Notify owner
    await sendEmail(
      process.env.EMAIL_USER,
      `🎬 New Contact • ${subject.trim()}`,
      ownerEmail(
        name.trim(),
        email.trim(),
        subject.trim(),
        message.trim()
      )
    );

    console.log("✅ Owner notification sent");

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: savedMessage,
    });

  } catch (error) {

    console.error("=================================");
    console.error("❌ CONTACT ROUTE ERROR");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: error.message || "Server error while sending message.",
    });
  }
});

/* =====================================================
   GET ALL CONTACT MESSAGES
   GET /api/contact
===================================================== */

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

    console.error("=================================");
    console.error("❌ GET CONTACTS ERROR");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch messages.",
    });
  }
});

/* =====================================================
   DELETE CONTACT MESSAGE
   DELETE /api/contact/:id
===================================================== */

router.delete("/:id", async (req, res) => {
  try {

    const message = await Contact.findByPk(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    await message.destroy();

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });

  } catch (error) {

    console.error("=================================");
    console.error("❌ DELETE CONTACT ERROR");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to delete message.",
    });
  }
});

module.exports = router;