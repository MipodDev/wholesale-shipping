const RuleData = require("../models/rule.model");
const colors = require("colors");
const { v4: uuidv4 } = require("uuid");

async function createRule(req_id, input) {
  console.log(`[${req_id}] Creating rule:`.blue, input.name);

  try {
    const new_rule = {
      id: uuidv4(),
      name: input.name,
      range: input.range.toLowerCase(),
      type: input.type.toLowerCase(),
      states: input.states,
      cities: input.cities ? input.cities : [],
      zipCodes: input.zipCodes ? input.zipCodes : [],
      lists: input.lists,
    };

    if (input.range === "city" && input.cities.length < 1) {
      throw new Error(
        `[${req_id}] Range (city) requires selection(s) for at least one city.`
      );
    }
    if (input.range === "zip code" && input.zipCodes.length < 1) {
      throw new Error(
        `[${req_id}] Range (zip code) requires selection(s) for at least zip code.`
      );
    }

    try {
      const created = await RuleData.create(new_rule);
      console.log(`[${req_id}] Rule created successfully:`.green, new_rule.id);
      // Process a single rule, to attach listed products & assigned states
      return created;
    } catch (error) {
      return error;
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateRule(req_id, object_id, input) {
  console.log(`[${req_id}] Updating rule:`.blue, object_id);
  try {
    const existing = await RuleData.findOne({ id: object_id });
    existing.name = input.name;
    existing.range = input.range.toLowerCase();
    existing.type = input.type.toLowerCase();
    existing.states = input.states;
    existing.cities = input.cities ? input.cities : [];
    existing.zipCodes = input.zipCodes ? input.zipCodes : [];
    existing.lists = input.lists;
   const saved = await existing.save();
    console.log(`[${req_id}] Updated rule:`.green.bold, object_id);
    return saved;
} catch (error) {
    return error;
  }
}
async function deleteRule(req_id, object_id) {
  console.log(`[${req_id}] Deleting rule:`.blue, object_id);
  try {
    await RuleData.deleteOne({ id: object_id });
    console.log(`[${req_id}] Rule deleted successfully`.green);
    // Process all rules, removing rule from affected states
    return { message: "Rule deleted" };
  } catch (error) {
    return error;
  }
}
async function getRuleById(req_id, object_id) {
  console.log(`[${req_id}] Retreiving rule:`.blue, object_id);
  try {
    const rule = await RuleData.findOne({ id: object_id });
    return rule;
  } catch (error) {
    return error;
  }
}
async function getAllRules(req_id) {
  console.log(`[${req_id}] Retreiving all rules`.blue);
  try {
    const rules = await RuleData.find();
    return rules;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createRule,
  updateRule,
  deleteRule,
  getRuleById,
  getAllRules,
};
