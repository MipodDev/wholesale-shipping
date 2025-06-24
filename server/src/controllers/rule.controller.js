const RuleData = require("../models/rule.model");
const { v4: uuidv4 } = require("uuid");
const listData = require("../models/list.model");

async function getAllRules(req_id) {
  const rules = await RuleData.find().select("id name type range lists states cities skus");
  return rules;
}

async function getRuleById(req_id, id) {
  const rule = await RuleData.findOne({ id });
  return rule;
}

async function createRule(req_id, input) {
  const { name, type, range, lists } = input;

  const newRule = new RuleData({
    id: uuidv4(),
    name,
    type,
    range,
    lists,
    states: [],
    cities: [],
    skus: [],
  });

  const saved = await newRule.save();
  return saved;
}

async function updateRule(req_id, id, input) {
  const rule = await RuleData.findOne({ id });
  if (!rule) throw new Error("Rule not found");

  rule.name = input.name;
  rule.type = input.type;
  rule.range = input.range;
  rule.lists = input.lists;

  const saved = await rule.save();
  return saved;
}

async function deleteRule(req_id, id) {
  const deleted = await RuleData.deleteOne({ id });
  return { deleted: deleted.deletedCount === 1 };
}

module.exports = {
  getAllRules,
  getRuleById,
  createRule,
  updateRule,
  deleteRule,
};
