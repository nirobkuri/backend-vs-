const express = require("express");
const router = express.Router();
const {
  getAllNews, getTopNews, getSingleNews,
  createNews, updateNews, deleteNews, getMyNews,
} = require("../controllers/newsController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router.get("/", getAllNews);
router.get("/top", getTopNews);
router.get("/my-news", protect, getMyNews);
router.get("/:id", getSingleNews);
router.post("/", protect, upload.single("image"), createNews);
router.put("/:id", protect, upload.single("image"), updateNews);
router.delete("/:id", protect, deleteNews);

module.exports = router;