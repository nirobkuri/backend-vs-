const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error("Please fill all fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); throw new Error("User already exists");
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    avatar: user.avatar, bio: user.bio, role: user.role,
    token: generateToken(user._id),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id, name: user.name, email: user.email,
      avatar: user.avatar, bio: user.bio, role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); throw new Error("Invalid email or password");
  }
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

module.exports = { registerUser, loginUser, getMe };