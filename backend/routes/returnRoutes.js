const express = require("express");

const {
  createReturnRequest,
  getMyReturnRequests,
  getAdminReturnRequests,
  updateReturnRequest,
} = require(
  "../controllers/returnController"
);

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();


// USER
router.post(
  "/",
  protect,
  createReturnRequest
);

router.get(
  "/my",
  protect,
  getMyReturnRequests
);


// ADMIN
router.get(
  "/admin",
  protect,
  adminOnly,
  getAdminReturnRequests
);

router.put(
  "/admin/:id",
  protect,
  adminOnly,
  updateReturnRequest
);

module.exports = router;