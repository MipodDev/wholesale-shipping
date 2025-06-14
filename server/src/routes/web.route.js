const express = require("express");
const router = express.Router();
const State = require("../models/state.model");
const Rule = require("../models/rule.model");

const { v4: uuidv4 } = require("uuid");

// GET /web/states
router.get("/states", async (req, res) => {
  const req_id = uuidv4();
  try {
    const states = await State.find(
      {},
      {
        code: 1,
        name: 1,
        status: 1,
        rules: 1,
        zipCodes: 1,
        services: 1,
      }
    );

    const simplified = states.map((state) => ({
      code: state.code,
      name: state.name,
      status: state.status,
      rules: (state.rules || []).map((r) => ({ name: r.name })),
      services: (state.services || []).map((s) => ({ name: s.name })),
      zipCodes: (state.zipCodes || []).length,
    }));

    res.status(200).send(simplified);
  } catch (err) {
    res.status(500).send({ message: "Failed to load states", err });
  }
});

// GET /web/states/:stateCode
router.get("/states/:stateCode", async (req, res) => {
  const stateCode = req.params.stateCode.toUpperCase();
  try {
    const state = await State.findOne({ code: stateCode });
    if (!state) return res.status(404).send({ message: "State not found" });
    res.status(200).send(state);
  } catch (err) {
    res.status(500).send({ message: "Error loading state", err });
  }
});

// GET /web/states
router.get("/rules", async (req, res) => {
  const req_id = uuidv4();
  try {
    const rules = await Rule.find(
      {},
      {
        id: 1,
        name: 1,
        range: 1,
        type: 1,
        states: 1,
        cities: 1,
        lists: 1,
        skus: 1, 
      }
    );

    const simplified = rules.map((rule) => ({
      id: rule.id,
      name: rule.name,
      range: rule.range,
      type: rule.type,
      states: rule.states,
      cities: rule.cities,
      lists: rule.lists,
      skus: rule.skus,
    }));

    res.status(200).send(simplified);
  } catch (err) {
    res.status(500).send({ message: "Failed to load rules", err });
  }
});

// GET /web/states/:stateCode
router.get("/rules/:id", async (req, res) => {
  const rule_id = req.params.id;
  try {
    const rule = await Rule.findOne({ id: rule_id });
    if (!rule) return res.status(404).send({ message: "Rule not found" });
    res.status(200).send(rule);
  } catch (err) {
    res.status(500).send({ message: "Error loading rule", err });
  }
});

module.exports = router;
