const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const { name, bio, password } = req.body;
  user.name = name || user.name;
  user.bio = bio || user.bio;
  if (req.file) user.avatar = req.file.path;
  if (password) {
    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be 6+ characters");
    }
    user.password = password;
  }
  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    avatar: updated.avatar,
    bio: updated.bio,
    role: updated.role,
    token: generateToken(updated._id),
  });
});

const getPublicUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -email -role",
  );
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

module.exports = { getUserProfile, updateUserProfile, getPublicUserProfile };
