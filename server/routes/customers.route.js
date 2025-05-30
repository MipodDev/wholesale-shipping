const express = require("express");
const router = express.Router();
const colors = require("colors");
const { synchronizeCustomers } = require("../services/customer.service");

router.post("/", async (req, res) => {
  res.send("Request Received to synchronize customers.");
   (async () => {
     try {
    await synchronizeCustomers();
     } catch (error) {
       console.error(error);
     }
   })();
});

module.exports = router;
