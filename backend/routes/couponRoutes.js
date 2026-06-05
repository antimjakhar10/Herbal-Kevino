const express = require("express");

const {
  createCoupon,
  getCoupons,
  validateCoupon,
  getPublicCoupons,
  deleteCoupon,
} = require("../controllers/couponController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/admin",
  protect,
  adminOnly,
  createCoupon
);

router.get(
  "/admin",
  protect,
  adminOnly,
  getCoupons
);

router.post(
  "/validate",
  validateCoupon
);

router.get(
  "/available",
  getPublicCoupons
);

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteCoupon
);

module.exports = router;