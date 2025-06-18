const express = require("express");
const router = express.Router();
const State = require("../models/state.model");
const Rule = require("../models/rule.model");
const Service = require("../models/service.model");
const Product = require("../models/product.model");
const Customer = require("../models/customer.model");

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
      minimum_order_value: service.minimum_order_value
        ? service.minimum_order_value
        : 0,
      price: service.price,
      free_shipping_threshold: service.free_shipping_threshold
        ? service.free_shipping_threshold
        : 0,
      per_box_value_set: service.per_box_value_set
        ? `$${(service.per_box_value_set / 100).toFixed(2)}`
        : `unset`,
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
// GET /web/products
router.get("/products", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 25;
  const skip = (page - 1) * pageSize;

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(pageSize),
    Product.countDocuments(),
  ]);

  res.json(products);
});

// POST /web/products/summary
router.post("/products/summary", async (req, res) => {
  const { filters = {} } = req.body;

  const query = {};

  if (filters.query) {
    const q = new RegExp(filters.query, "i");
    query.$or = [{ title: { $regex: q } }, { unique_skus: { $regex: q } }];
  }

  if (filters.status?.length) {
    query.status = { $in: filters.status };
  }

  if (filters.category?.length) {
    query.category = { $in: filters.category };
  }

  if (filters.tags?.length) {
    query.tags = { $in: filters.tags };
  }

  try {
    const all = await Product.find(query);
    const total = all.length;
    const active = all.filter((p) => p.status === "ACTIVE").length;
    const inactive = all.filter((p) => p.status !== "ACTIVE").length;
    const unclassified = all.filter((p) => !p.tags?.length).length;

    res.json({ total, active, inactive, unclassified });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Failed to get summary" });
  }
});

// routes/products.js
router.get("/products/filters", async (req, res) => {
  try {
    const [statuses, categories, rawTags] = await Promise.all([
      Product.aggregate([
        { $match: { status: { $ne: null } } },
        { $group: { _id: "$status" } },
      ]),
      Product.aggregate([
        { $match: { category: { $ne: null } } },
        { $group: { _id: "$category" } },
      ]),
      Product.aggregate([
        { $unwind: "$tags" },
        { $match: { tags: { $ne: null } } },
        { $group: { _id: "$tags" } },
      ]),
    ]);

    res.json({
      statuses: statuses.map((s) => s._id),
      categories: categories.map((c) => c._id),
      tags: rawTags.map((t) => t._id),
    });
  } catch (err) {
    console.error("Error in /products/filters:", err);
    res.status(500).json({ error: "Failed to load filter options" });
  }
});

// POST /web/products/search
router.post("/products/search", async (req, res) => {
  const { filters = {}, skip = 0, limit = 25 } = req.body;

  const query = {};

  if (filters.query) {
    const q = new RegExp(filters.query, "i");
    query.$or = [{ title: { $regex: q } }, { unique_skus: { $regex: q } }];
  }

  if (filters.status?.length) {
    query.status = { $in: filters.status };
  }

  if (filters.category?.length) {
    query.category = { $in: filters.category };
  }

  if (filters.tags?.length) {
    query.tags = { $in: filters.tags };
  }

  try {
    const products = await Product.find(query).skip(skip).limit(limit);
    res.json(products);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to search products" });
  }
});

// GET /web/products/:product_id
router.get("/products/:product_id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.product_id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/customers", async (req, res) => {
  const customers = await Customer.find();
  res.send({customers, total: customers.length});
});
router.post("/customers/search", async (req, res) => {
  const { filters = {}, skip = 0, limit = 25 } = req.body;
  const query = {};

  if (filters.query) {
    const regex = new RegExp(filters.query, "i");
    query.$or = [{ email: regex }, { phone: regex }];
  }

  if (filters.site?.length) {
    query.site = { $in: filters.site };
  }

  if (filters.hasCustomerNumber === true) {
    query.customerNumber = { $ne: null };
  } else if (filters.hasCustomerNumber === false) {
    query.customerNumber = null;
  }

  try {
    const [customers, total] = await Promise.all([
      Customer.find(query).skip(skip).limit(limit),
      Customer.countDocuments(query),
    ]);
    res.json({ customers, total });
  } catch (err) {
    res.status(500).json({ error: "Failed to load customers" });
  }
});

module.exports = router;
