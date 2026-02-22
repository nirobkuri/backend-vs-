const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      // Check if user actually exists in DB
      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      return next(); // Exit completely here on success
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // 2. This part only runs if the 'if' condition above was false
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403);
  throw new Error("Not authorized as admin");
};

module.exports = { protect, admin };
