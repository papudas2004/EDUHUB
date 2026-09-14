// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Intercepts request to ensure token is valid
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Access Denied: Missing authorization token." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Sets fields like req.user.role
    next();
  } catch (err) {
    res.status(403).json({ error: "Access Denied: Invalid security session." });
  }
};

// Protects paths based on user roles
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Permission Denied: Insufficient application privileges." });
    }
    next();
  };
};

module.exports = { verifyToken, restrictTo };
