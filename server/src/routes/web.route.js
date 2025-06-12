const express = require("express");
const router = express.Router();
const State = require("../models/state.model");
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
        "rules.name": 1,
        zipCodes: 1,
        services: 1,
      }
    );
    console.log("States in table:", states);

    const simplified = states.map((state) => ({
      code: state.code,
      name: state.name,
      status: state.status,
      rules: (state.rules || []).map((r) => r.name),
      zipCodes: (state.zipCodes || []).length,
      services: (state.services || []).length,
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

module.exports = router;
