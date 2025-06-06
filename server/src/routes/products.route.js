const express = require("express");
const router = express.Router();
const colors = require("colors");
const { v4: uuidv4 } = require("uuid");
const { synchronizeProducts } = require("../services/product.service");

router.post("/synchronize/:site", async (req, res) => {
  const site = req.params.site;
  const req_id = uuidv4();
  res.send({ message: `Request Received to Synchronize Products on ${site}` });
  (async () => {
    try {
      await synchronizeProducts(req_id, site);
    } catch (error) {
      console.error(error);
    }
  })();
});

module.exports = router;
