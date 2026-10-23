const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const sequelize = require("./database/db");
const ensureReaderPasswordAuth = require("./migrations/readerPasswordAuth");

const articleRoutes = require("./routes/articles");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const newsletterRoutes = require("./routes/newsletter");

const app = express();
const PORT = process.env.PORT || 5055;


// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  ...(process.env.FRONTEND_URL || "").split(",").map((url) => url.trim()).filter(Boolean),
];
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

// Routes
app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running (Neon PostgreSQL)");
});

// Start server
sequelize
  .sync()
  .then(async () => {
    await ensureReaderPasswordAuth(sequelize);
    console.log("Neon PostgreSQL connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database initialization failed:", err.name || "UnknownError");
  });
