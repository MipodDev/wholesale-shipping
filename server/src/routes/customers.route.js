const express = require("express");
const router = express.Router();
const colors = require("colors");
const { synchronizeCustomers } = require("../services/customer.service");

router.post("/synchronize/:site", async (req, res) => {
  res.send("Request Received to synchronize customers.");
  const site = req.params.site;
   (async () => {
     try {
    await synchronizeCustomers(site);
     } catch (error) {
       console.error(error);
     }
   })();
});

module.exports = router;
