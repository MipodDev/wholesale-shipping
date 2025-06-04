const express = require("express");
const router = express.Router();
const colors = require("colors");
const { synchronizeCustomers } = require("../services/customer.service");
const { v4: uuidv4 } = require("uuid");

router.post("/synchronize/:site", async (req, res) => {
  res.send({message: "Request Received to synchronize customers."});
  const req_id = uuidv4();
  const site = req.params.site;
   (async () => {
     try {
    await synchronizeCustomers(req_id, site);
     } catch (error) {
       console.error(error);
     }
   })();
});

module.exports = router;
