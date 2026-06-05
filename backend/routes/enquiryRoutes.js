const express = require("express");
const {
  createEnquiry,
  getAdminEnquiries,
  deleteEnquiry,
} = require("../controllers/enquiryController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createEnquiry);
router.get("/admin", protect, adminOnly, getAdminEnquiries);
router.delete("/admin/:id", protect, adminOnly, deleteEnquiry);

module.exports = router;