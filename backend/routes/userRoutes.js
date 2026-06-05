const express = require("express");

const {
  getWishlist,
  toggleWishlist,
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getUsers,
  deleteUser,
} = require("../controllers/userController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/toggle", protect, toggleWishlist);

router.get("/cart", protect, getCart);
router.post("/cart/add", protect, addToCart);
router.put("/cart/update", protect, updateCartQuantity);
router.delete("/cart/remove", protect, removeFromCart);
router.delete("/cart/clear", protect, clearCart);

router.get("/", protect, adminOnly, getUsers);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);

module.exports = router;