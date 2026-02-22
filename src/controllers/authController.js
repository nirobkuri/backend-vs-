const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if all fields are provided
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  // 2. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // 3. Create the user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // 4. Send success response with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

module.exports = { registerUser, loginUser, getMe };
