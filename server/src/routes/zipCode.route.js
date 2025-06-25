const express = require("express");
const router = express.Router();
const colors = require("colors");
const { v4: uuidv4 } = require("uuid");
const { loadZipCodes, aggregateData } = require("../services/zipCode.service");
const { updateLog } = require("../services/sync.service");

router.post("/load", async (req, res) => {
  res.status(200);

  (async () => {
    try {
      await loadZipCodes();
      await updateLog({ table: "Zip Codes", status: "Success" });
    } catch (error) {
      await updateLog({ table: "Zip Codes", status: "Failed" });

      console.error(error);
    }
  })();
});

router.post("/aggregate", async (req, res) => {
  const response = await aggregateData();
  res.status(200);
});

module.exports = router;
