const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const ADMIN_USER = {
  username: "admin",
  // password = "password123"
  password: "$2a$10$y7qO6kQqg3QJQmZk8v1J3eJQfYgQ0QmZx9u7fQwQm9a8aQv8xZx8a",
};

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== ADMIN_USER.username) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, ADMIN_USER.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: ADMIN_USER.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;