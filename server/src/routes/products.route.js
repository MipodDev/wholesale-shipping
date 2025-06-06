const express = require("express");
const router = express.Router();
const colors = require("colors");
const { v4: uuidv4 } = require("uuid");
const { synchronizeProducts, synchronizeOneProduct } = require("../services/product.service");

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

router.post("/synchronize/:site/:product_id", async (req, res) => {
  const site = req.params.site;
  const product_id = req.params.product_id;
  const req_id = uuidv4();
  res.send({ message: `Request Received to Synchronize Product on ${site}: ${product_id}` });
  (async () => {
    try {
      await synchronizeOneProduct(req_id, site, product_id);
    } catch (error) {
      console.error(error);
    }
  })();
});

module.exports = router;
