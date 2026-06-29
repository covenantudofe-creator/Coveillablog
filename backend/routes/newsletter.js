const express = require("express");
const router = express.Router();

const Newsletter = require("../models/Newsletter");

const sendEmail = require("../utils/sendEmail");

const newsletterWelcome = require("../emails/newsletterWelcome");
const newsletterOwner = require("../emails/newsletterOwner");

/*
POST
/api/newsletter
*/

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const existing = await Newsletter.findOne({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You're already subscribed.",
      });
    }

    const subscriber = await Newsletter.create({
      email,
    });

    // Welcome email
    await sendEmail(
      email,
      "🎬 Welcome to Coveilla",
      newsletterWelcome(email)
    );

    // Notify owner
    await sendEmail(
      process.env.EMAIL_USER,
      "🎉 New Newsletter Subscriber",
      newsletterOwner(email)
    );

    res.status(201).json({
      success: true,
      message: "Successfully subscribed!",
      subscriber,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
});

/*
GET ALL SUBSCRIBERS
*/

router.get("/", async (req, res) => {

  const subscribers = await Newsletter.findAll({
    order: [["createdAt", "DESC"]],
  });

  res.json(subscribers);

});

/*
DELETE SUBSCRIBER
*/

router.delete("/:id", async (req, res) => {

  const subscriber = await Newsletter.findByPk(req.params.id);

  if (!subscriber) {
    return res.status(404).json({
      success: false,
      message: "Subscriber not found.",
    });
  }

  await subscriber.destroy();

  res.json({
    success: true,
    message: "Subscriber deleted.",
  });

});

module.exports = router;