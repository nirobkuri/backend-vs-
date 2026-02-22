const express = require("express");
const router = express.Router();
const {
  submitContact,
  getContacts,
} = require("../controllers/contactController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", submitContact);
router.get("/", protect, admin, getContacts);

module.exports = router;
