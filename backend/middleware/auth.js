const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(503).json({ message: "Authentication is not configured." });
  }

  const [scheme, token] = (req.get("authorization") || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    req.user = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
    return next();
  } catch {
    return res.status(401).json({ message: "Your session is invalid or has expired." });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed to perform this action." });
    }
    return next();
  };
}

module.exports = { authenticateToken, requireRole };
