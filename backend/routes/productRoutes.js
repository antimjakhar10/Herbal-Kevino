const express = require("express");

const {
  createProduct,
  getProducts,
  getAdminProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/admin", protect, adminOnly, getAdminProducts);
router.get("/:slug", getSingleProduct);

router.post(
  "/admin",
  protect,
  adminOnly,
  upload.array("images", 5),
  createProduct
);

router.post(
  "/:id/review",
  protect,
  addReview
);

router.put(
  "/admin/:id",
  protect,
  adminOnly,
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/admin/:productId/review/:reviewId",
  protect,
  adminOnly,
  deleteReview
);

router.delete("/admin/:id", protect, adminOnly, deleteProduct);

module.exports = router;