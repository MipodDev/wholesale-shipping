const express = require("express");
const router = express.Router();
const State = require("../models/state.model");
const Rule = require("../models/rule.model");
const Service = require("../models/service.model");

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

// GET /web/rules
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

// GET /web/rules/:rule_id
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

// GET /web/services
router.get("/services", async (req, res) => {
  const req_id = uuidv4();
  try {
    const services = await Service.find(
      {},
      {
        id: 1,
        name: 1,
        description: 1,
        provinces: 1,
        minimum_order_value: 1,
        price: 1,
        free_shipping_threshold: 1,
        per_box_value_set: 1,
        service_name: 1,
        service_code: 1,
        for_zips: 1,
        mapped_carrier: 1,
      }
    );

    const simplified = services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      provinces: service.provinces,
      minimum_order_value: service.minimum_order_value? service.minimum_order_value : 0,
      price: service.price,
      free_shipping_threshold: service.free_shipping_threshold? service.free_shipping_threshold : 0,
      per_box_value_set: service.per_box_value_set ? `$${(service.per_box_value_set / 100).toFixed(2)}` : `unset`,
      service_name: service.service_name,
      service_code: service.service_code,
      for_zips: service.for_zips,
      mapped_carrier: service.mapped_carrier,
    }));

    res.status(200).send(simplified);
  } catch (err) {
    res.status(500).send({ message: "Failed to load services", err });
  }
});

// GET /web/services/:service_id
router.get("/services/:id", async (req, res) => {
  const service_id = req.params.id;
  try {
    const service = await Service.findOne({ id: service_id });
    if (!service) return res.status(404).send({ message: "Service not found" });
    res.status(200).send(service);
  } catch (err) {
    res.status(500).send({ message: "Error loading service", err });
  }
});

module.exports = router;
