const express = require("express");
const {
  createCategory,
  getCategories,
  getActiveCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getActiveCategories);

router.get("/admin", protect, adminOnly, getCategories);

router.post(
  "/admin",
  protect,
  adminOnly,
  upload.single("image"),
  createCategory
);

router.put(
  "/admin/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateCategory
);

router.delete("/admin/:id", protect, adminOnly, deleteCategory);

module.exports = router;