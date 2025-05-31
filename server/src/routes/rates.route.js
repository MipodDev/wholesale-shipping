const express = require("express");
const router = express.Router();
const colors = require("colors");
const { getRates } = require("../controllers/rate.controller");
const { v4: uuidv4 } = require("uuid");

router.post("/:site", async (req, res) => {
  const req_id = uuidv4();
  const rate_request = req.body.rate;
  // console.log(req.body);
  const site = req.params.site;
  let rateResponse = [];
  try {
    rateResponse = await getRates(req_id, site, rate_request);
  } catch (error) {
    console.log(`Error Processing Rate Request:`, error);
  }
  res.status(200).send(rateResponse);
});

module.exports = router;
