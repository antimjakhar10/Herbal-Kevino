const express = require("express");
const {
  createTestimonial,
  getTestimonials,
  getAdminTestimonials,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getTestimonials);
router.get("/admin", protect, adminOnly, getAdminTestimonials);

router.post(
  "/admin",
  protect,
  adminOnly,
  upload.single("image"),
  createTestimonial
);

router.put(
  "/admin/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateTestimonial
);

router.delete("/admin/:id", protect, adminOnly, deleteTestimonial);

module.exports = router;