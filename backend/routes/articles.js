const express = require("express");
const Article = require("../models/Article");
const { authenticateToken, requireRole } = require("../middleware/auth");

const adminOnly = [authenticateToken, requireRole("admin")];
const articleFields = ["title", "slug", "content", "category", "image", "subtitle"];
const articleValues = (body) => Object.fromEntries(
  articleFields.filter((field) => Object.hasOwn(body || {}, field)).map((field) => [field, body[field]])
);

function createArticleRouter({ ArticleModel = Article } = {}) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      return res.json(await ArticleModel.findAll());
    } catch {
      return res.status(500).json({ message: "Unable to fetch articles." });
    }
  });

  router.get("/:slug", async (req, res) => {
    try {
      const article = await ArticleModel.findOne({ where: { slug: req.params.slug } });
      if (!article) return res.status(404).json({ message: "Article not found." });
      return res.json(article);
    } catch {
      return res.status(500).json({ message: "Unable to fetch article." });
    }
  });

  router.post("/", ...adminOnly, async (req, res) => {
    const values = articleValues(req.body);
    if (!values.title?.trim() || !values.slug?.trim() || !values.content?.trim()) {
      return res.status(400).json({ message: "Title, slug, and content are required." });
    }
    try {
      const article = await ArticleModel.create(values);
      return res.status(201).json(article);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ message: "An article with this slug already exists." });
      }
      return res.status(500).json({ message: "Unable to create article." });
    }
  });

  router.put("/:slug", ...adminOnly, async (req, res) => {
    try {
      const [updated] = await ArticleModel.update(articleValues(req.body), {
        where: { slug: req.params.slug },
      });
      if (!updated) return res.status(404).json({ message: "Article not found." });
      const article = await ArticleModel.findOne({ where: { slug: req.params.slug } });
      return res.json(article);
    } catch {
      return res.status(500).json({ message: "Unable to update article." });
    }
  });

  router.delete("/:slug", ...adminOnly, async (req, res) => {
    try {
      const deleted = await ArticleModel.destroy({ where: { slug: req.params.slug } });
      if (!deleted) return res.status(404).json({ message: "Article not found." });
      return res.json({ message: "Article deleted successfully." });
    } catch {
      return res.status(500).json({ message: "Unable to delete article." });
    }
  });

  return router;
}

module.exports = createArticleRouter();
module.exports.createArticleRouter = createArticleRouter;
