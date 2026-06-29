require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./database/db");

const articleRoutes = require("./routes/articles");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const newsletterRoutes = require("./routes/newsletter");

const app = express();
const PORT = process.env.PORT || 5055;


// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ],
}));

app.use(express.json());

// Routes
app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running (SQLite)");
});

// Start server
sequelize
  .sync()
  .then(() => {
    console.log("SQLite connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database error:", err);
  });