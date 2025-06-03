const express = require("express");
const router = express.Router();
const colors = require("colors");
const {
  processRules,
} = require("../services/rule.service");

router.post("/process", async (req, res) => {
  res.send("Request Received to Process Rules.");
  (async () => {
    try {
      await processRules();
    } catch (error) {
      console.error(error);
    }
  })();
});

module.exports = router;
