const express = require("express");
const router = express.Router();
const colors = require("colors");
const { getRates } = require("../controllers/rate.controller");
const { v4: uuidv4 } = require("uuid");
const loggedRates = require("../models/requestLoq.model");

router.post("/:site", async (req, res) => {
  const req_id = uuidv4();
  const rate_request = req.body.rate;
  // console.log(req.body);
  const site = req.params.site;
  let response = {
    rates: [],

  };
  let loggedResponse = null;

  try {
    let { rates, rules, approval } = await getRates(
      req_id,
      site,
      rate_request
    );
    response.rates = rates;
    loggedResponse = {
      req_id,
      site,
      type: "Shopify",
      request: rate_request,
      rates,
      rules,
      approval,
    };

  } catch (error) {
    console.log(`Error Processing Rate Request:`, error);
  }
      try {
      await loggedRates.create(loggedResponse);
      console.log(`[${req_id}] Logged rate request`.green)

    } catch (error) {
      console.log(`Failure to save rate request`)
    }

  res.status(200).send(response);
});

router.post("/test/:site", async (req, res) => {
  const req_id = uuidv4();
  const rate_request = req.body.rate;
  // console.log(req.body);
  const site = req.params.site;

  let response = {
    rates: [],
    rules: [],
    approval: null,
  };
  let loggedResponse = null;

  try {
    let { rates, rules, approval } = await getRates(
      req_id,
      site,
      rate_request
    );

    response.rates = rates;
    response.rules = rules;
    response.approval = approval;
    loggedResponse = {
      req_id,
      site,
      type: "Manual",
      request: rate_request,
      rates,
      rules,
      approval,
    };

  } catch (error) {
    console.log(`Error Processing Rate Request:`, error);
  }
    try {
      await loggedRates.create(loggedResponse);
      console.log(`[${req_id}] Logged rate request`.green)

    } catch (error) {
      console.log(`Failure to save rate request`)
    }
  res.status(200).send(response);
});

module.exports = router;
