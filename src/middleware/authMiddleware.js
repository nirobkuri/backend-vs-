const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Protect middleware
const protect = async (req, res) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ message: "Not authorized" });

      // এখানে আগের মতো next() নেই, তাই route কে কল করার জন্য আবার response handle করতে হবে
      return res.json({ message: "User is authorized", user });
    } catch (error) {
      return res.status(401).json({ message: "Token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};
// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };
