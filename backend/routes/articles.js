const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// GET all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.findAll();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single article by slug
router.delete("/:slug", async (req, res) => {
  try {
    const deleted = await Article.destroy({
      where: { slug: req.params.slug },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE article
router.put("/:slug", async (req, res) => {
  try {
    const updated = await Article.update(req.body, {
      where: { slug: req.params.slug },
    });

    if (!updated[0]) {
      return res.status(404).json({ message: "Article not found" });
    }

    const newArticle = await Article.findOne({
      where: { slug: req.params.slug },
    });

    res.json(newArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;