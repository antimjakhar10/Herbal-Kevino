const express = require("express");
const router = express.Router();

const {
  savePolicy,
  getPolicy,
} = require("../controllers/policyController");

router.post("/", savePolicy);

router.get("/:type", getPolicy);

module.exports = router;