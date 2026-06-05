const express = require("express");

const {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/orderController");
const { generateInvoice } = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/razorpay/create-order", protect, createRazorpayOrder);

router.post("/razorpay/verify", protect, verifyRazorpayPayment);

router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

router.get("/admin", protect, adminOnly, getAllOrders);

router.get("/admin/stats", protect, adminOnly, getOrderStats);

router.get("/invoice/:id", protect, generateInvoice);

router.get("/:id", protect, getSingleOrder);

router.put("/admin/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;
