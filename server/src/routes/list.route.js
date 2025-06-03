const express = require("express");
const router = express.Router();
const colors = require("colors");
const { processLists } = require("../services/list.service");

router.post("/process", async (req, res) => {
  res.send("Request Received to Process Lists.");
  (async () => {
    try {
      await processLists();
    } catch (error) {
      console.error(error);
    }
  })();
});

module.exports = router;
