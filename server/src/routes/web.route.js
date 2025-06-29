const express = require("express");
const router = express.Router();
const State = require("../models/state.model");
const Rule = require("../models/rule.model");
const Service = require("../models/service.model");
const Product = require("../models/product.model");
const Customer = require("../models/customer.model");
const List = require("../models/list.model");
const { updateRulesForState } = require("../services/state.service");
const Sync = require("../models/sync.model");
const RequestLog = require("../models/requestLoq.model"); // Ensure the correct path

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
router.put("/states/:stateCode", async (req, res) => {
  const stateCode = req.params.stateCode.toUpperCase();
  const { status, rules = [] } = req.body;

  if (!["enabled", "disabled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const ruleDocs = await Rule.find({ name: { $in: rules } });

    const updated = await State.findOneAndUpdate(
      { code: stateCode },
      { $set: { status, rules: ruleDocs } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "State not found" });

    const req_id = `UI-${Date.now()}`;
    await updateRulesForState(req_id, stateCode, rules);

    res.status(200).json({ message: "State updated", state: updated });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Failed to update state", error: err });
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

// CREATE Rule
router.post("/rules", async (req, res) => {
  const { name, range, type, lists = [] } = req.body;

  if (!name || !range || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const listDocs = await List.find({ id: { $in: lists.map((l) => l.id) } });
    const newRule = new Rule({
      id: uuidv4(),
      name,
      range,
      type,
      lists: listDocs,
    });

    await newRule.save();
    res.status(201).json({ message: "Rule created", rule: newRule });
  } catch (err) {
    console.error("Error creating rule:", err);
    res.status(500).json({ message: "Failed to create rule", error: err });
  }
});

// UPDATE Rule
router.put("/rules/:rule_id", async (req, res) => {
  const rule_id = req.params.rule_id;
  const { name, range, type, lists = [] } = req.body;

  try {
    const listDocs = await List.find({ id: { $in: lists.map((l) => l.id) } });
    const updated = await Rule.findOneAndUpdate(
      { id: rule_id },
      {
        $set: {
          name,
          range,
          type,
          lists: listDocs,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Rule not found" });
    }

    res.status(200).json({ message: "Rule updated", rule: updated });
  } catch (err) {
    console.error("Error updating rule:", err);
    res.status(500).json({ message: "Failed to update rule", error: err });
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
  res.send({ customers, total: customers.length });
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

router.get("/lists", async (req, res) => {
  try {
    const lists = await List.find(
      {},
      {
        id: 1,
        name: 1,
        category: 1,
        skus: 1,
        include: 1,
        exclude: 1,
      }
    );
    const simplified = lists.map((list) => ({
      id: list.id,
      name: list.name,
      category: list.category,
      skus: list.skus ? list.skus.length : 0,
      include: list.include,
      exclude: list.exclude,
    }));

    res.status(200).send(simplified);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/lists/:list_id", async (req, res) => {
  const list_id = req.params.list_id;

  try {
    const list = await List.findOne({ id: list_id });
    res.status(200).send(list);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST /web/lists
router.post("/lists", async (req, res) => {
  const { name, category, skus, include, exclude, products } = req.body;

  try {
    const newList = new List({
      id: uuidv4(),
      name,
      category,
      skus: skus || [],
      include: include || [],
      exclude: exclude || [],
      products: products || [],
    });

    await newList.save();
    res
      .status(201)
      .json({ message: "List created successfully", list: newList });
  } catch (err) {
    console.error("Error creating list:", err);
    res.status(500).json({ message: "Failed to create list", error: err });
  }
});

// PUT /web/lists/:list_id
router.put("/lists/:list_id", async (req, res) => {
  const list_id = req.params.list_id;
  const { name, category, skus, include, exclude, products } = req.body;

  try {
    const updated = await List.findOneAndUpdate(
      { id: list_id },
      {
        $set: {
          name,
          category,
          skus: skus || [],
          include: include || [],
          exclude: exclude || [],
          products: products || [],
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "List not found" });
    }

    res.json({ message: "List updated successfully", list: updated });
  } catch (err) {
    console.error("Error updating list:", err);
    res.status(500).json({ message: "Failed to update list", error: err });
  }
});

router.get("/summary/sync", async (req, res) => {
  const syncSummary = await Sync.find();
  res.status(200).send(syncSummary);
});

router.get("/summary/logs", async (req, res) => {
  try {
    const now = new Date();
    const getSince = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const [last10, count24h, count7d, count30d, denied24h, logsForChart] = await Promise.all([
      RequestLog.find().sort({ createdAt: -1 }).limit(10),
      RequestLog.countDocuments({ createdAt: { $gte: getSince(1) } }),
      RequestLog.countDocuments({ createdAt: { $gte: getSince(7) } }),
      RequestLog.countDocuments({ createdAt: { $gte: getSince(30) } }),
      RequestLog.countDocuments({
        createdAt: { $gte: getSince(1) },
        "approval.allow": false,
      }),
      RequestLog.find({ createdAt: { $gte: getSince(30) } }, "approval rules"),
    ]);

    const chart = {
      approved_with_rules: 0,
      approved_no_rules: 0,
      denied_with_rules: 0,
      denied_no_rules: 0,
    };

    logsForChart.forEach((log) => {
      const approved = log.approval?.allow;
      const hasRules = log.rules && log.rules.length > 0;

      if (approved && hasRules) chart.approved_with_rules++;
      else if (approved && !hasRules) chart.approved_no_rules++;
      else if (!approved && hasRules) chart.denied_with_rules++;
      else chart.denied_no_rules++;
    });

    const last10Simplified = last10.map((log) => ({
      _id: log._id,
      site: log.site,
      type: log.type,
      approval: log.approval,
      rules: log.rules,
      createdAt: log.createdAt,
    }));

    res.json({
      last10: last10Simplified,
      count24h,
      count7d,
      count30d,
      denied24h,
      chart,
    });
  } catch (err) {
    console.error("Failed to get log summary:", err);
    res.status(500).json({ error: "Failed to get log summary" });
  }
});

router.get("/summary/logs/:id", async (req, res) => {
  try {
    const log = await RequestLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Request log not found" });
    res.json(log);
  } catch (err) {
    console.error("Error fetching log:", err);
    res.status(500).json({ message: "Failed to fetch request log", error: err });
  }
});

module.exports = router;
