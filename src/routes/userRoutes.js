const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile, getPublicUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("avatar"), updateUserProfile);
router.get("/:id", getPublicUserProfile);

module.exports = router;