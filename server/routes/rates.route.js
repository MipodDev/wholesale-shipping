const express = require("express");
const router = express.Router();
const colors = require("colors");


router.post("/", async (req, res) => {
  let rateResponse = [];
  const body = req.body;
  console.log(body);

  res.send(rateResponse);
});

module.exports = router;
