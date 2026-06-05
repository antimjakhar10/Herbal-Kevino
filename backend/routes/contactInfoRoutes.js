const express = require("express");

const {
  getContactInfo,
  updateContactInfo,
} = require("../controllers/contactInfoController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getContactInfo);

router.put(
  "/admin",
  protect,
  adminOnly,
  updateContactInfo
);

module.exports = router;