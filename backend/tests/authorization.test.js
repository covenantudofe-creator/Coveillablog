const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const jwt = require("jsonwebtoken");
const request = require("supertest");

process.env.DATABASE_URL ||= "postgres://test:test@127.0.0.1:5432/coveilla_test";
process.env.JWT_SECRET = "test-only-coveilla-auth-secret";
process.env.EMAIL_USER = "";

const { createArticleRouter } = require("../routes/articles");
const { createContactRouter } = require("../routes/contact");
const newsletterRouter = require("../routes/newsletter");
const sequelize = require("../database/db");
after(() => sequelize.close());

const tokenFor = (role) => jwt.sign({ sub: `test-${role}`, role }, process.env.JWT_SECRET, { expiresIn: "5m" });
const authHeader = (role) => ({ Authorization: `Bearer ${tokenFor(role)}` });

function articleApp() {
  const created = [];
  const app = express();
  app.use(express.json());
  app.use("/api/articles", createArticleRouter({
    ArticleModel: {
      async findAll() { return [{ slug: "public-story", title: "Public story" }]; },
      async findOne({ where }) { return where.slug === "public-story" ? { slug: where.slug } : null; },
      async create(values) { created.push(values); return { id: 1, ...values }; },
      async update() { return [1]; },
      async destroy() { return 1; },
    },
  }));
  return { app, created };
}

function contactApp() {
  const created = [];
  const app = express();
  app.use(express.json());
  app.use("/api/contact", createContactRouter({
    ContactModel: {
      async create(values) { created.push(values); return { id: 1, ...values }; },
      async findAll() { return [{ id: 1, subject: "Private message" }]; },
      async findByPk() { return { async destroy() {} }; },
    },
    sendEmailFn: async () => {},
    visitorEmailTemplate: () => "visitor mail",
    ownerEmailTemplate: () => "owner mail",
  }));
  app.use("/api/newsletter", newsletterRouter);
  return { app, created };
}

test("article reads remain public while writes require admin authorization", async () => {
  const { app, created } = articleApp();
  await request(app).get("/api/articles").expect(200);
  await request(app).post("/api/articles").send({ title: "A", slug: "a", content: "story" }).expect(401);
  await request(app).delete("/api/articles/public-story").set(authHeader("reader")).expect(403);
  await request(app).post("/api/articles").set(authHeader("admin"))
    .send({ title: "A", slug: "a", content: "story" }).expect(201);
  assert.equal(created.length, 1);
});

test("contact submissions remain public while message reads and deletes require admin", async () => {
  const { app, created } = contactApp();
  await request(app).post("/api/contact").send({
    name: "Reader", email: "reader@example.com", subject: "Hello", message: "Hi",
  }).expect(201);
  await request(app).get("/api/contact").expect(401);
  await request(app).delete("/api/contact/1").set(authHeader("reader")).expect(403);
  await request(app).get("/api/contact").set(authHeader("admin")).expect(200);
  await request(app).delete("/api/contact/1").set(authHeader("admin")).expect(200);
  assert.equal(created.length, 1);
});

test("newsletter subscriber administration rejects unauthenticated requests", async () => {
  const app = express();
  app.use("/api/newsletter", newsletterRouter);
  await request(app).get("/api/newsletter").expect(401);
  await request(app).delete("/api/newsletter/1").expect(401);
});
