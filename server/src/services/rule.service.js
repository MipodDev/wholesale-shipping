const RuleData = require("../models/rule.model");
const { v4: uuidv4 } = require("uuid");
const colors = require("colors");
const StateData = require("../models/state.model");

async function processRules(req_id) {
  const rules = await RuleData.find();
  console.log(`[${req_id}] Rules found:`.blue.bold, rules.length);
  for (let i = 0; i < rules.length; i++) {
    const rule = await RuleData.findOne({
      name: rules[i].name,
    });

    if (!rule.id) {
      console.log(`[${req_id}] Updating ID for Rule:`.yellow, rule.name);

      rule.id = uuidv4();
      try {
        const saved = await rule.save();
        console.log(`[${req_id}] Updated Mongo Record!`.green);
      } catch (error) {
        console.log(`[${req_id}] Failed to update Mongo Record:`.red, error);
      }
    }
    if (!rule.range) {
      console.log(`[${req_id}] Updating Range for Rule:`.yellow, rule.name);

      rule.range = "State";
      try {
        const saved = await rule.save();
        console.log(`[${req_id}] Updated Mongo Record!`.green);
      } catch (error) {
        console.log(`[${req_id}] Failed to update Mongo Record:`.red, error);
      }
    }
    if (!rule.type) {
      console.log(`[${req_id}] Updating type for Rule:`.yellow, rule.name);

      rule.type = "Ban";
      try {
        const saved = await rule.save();
        console.log(`[${req_id}] Updated Mongo Record!`.green);
      } catch (error) {
        console.log(`[${req_id}] Failed to update Mongo Record:`.red, error);
      }
    }

    const {
      id,
      name,
      targeted_skus,
      targeted_areas,
      targeted_lists,
      type,
      range,
    } = rule;
    console.log(`[${req_id}] Rule:`.magenta.bold, name);
    console.log(
      `[${req_id}] Total SKUs Targeted:`.magenta,
      targeted_skus.length
    );
    console.log(`[${req_id}] Target Areas:`.magenta);
    for (let state of targeted_areas) {
      console.log(`- ${state}`.blue);

      const existing_state = await StateData.findOne({ code: state });
      console.log(`[${req_id}] Updating:`, existing_state.name);
      if (!existing_state.rules) {
        existing_state.rules = [];
        console.log(`[${req_id}] Adding Rule...`.green);

        existing_state.rules.push({ id, name, targeted_lists, type, range });
      }
      if (existing_state.rules.length > 0) {
        for (let exRules of existing_state.rules) {
          if (exRules.name === name) {
            console.log(`Rule already assigned...`.yellow);
          } else {
            console.log(`Adding Rule...`.green);

            existing_state.rules.push({
              id,
              name,
              targeted_lists,
              type,
              range,
            });
          }
        }
      } else {
        console.log(`Adding Rule...`.green);

        existing_state.rules.push({ id, name, targeted_lists, type, range });
      }

      const saved = await existing_state.save();
      console.log(`[${req_id}] Updated mongo record...`.green.bold);
    }
    console.log(`[${req_id}] Target Lists:`.magenta);
    for (let list of targeted_lists) {
      console.log(`- ${list.name} (${list.category})`.blue);
    }
  }
}

async function updateRule(req_id, rule_id, input) {
  console.log(`[${req_id}] Updating Rule:`.blue.bold, rule_id);

  const rule = await RuleData.findOne({ id: rule_id });
  if (!rule) {
    throw new Error("Rule not found");
  }
  let xRule = rule;
  if (rule.name !== input.name) {
    console.log(`Updating rule name:`, name);
    rule.name = input.name;
  }
  if (rule.range !== input.range) {
    console.log(`Updating rule range:`, range);
    rule.range = input.range;
  }
  if (rule.type !== input.type) {
    console.log(`Updating rule type:`, type);
    rule.type = input.type;
  }
  if (rule.states !== input.states) {
    console.log(`Updating rule states:`, states);
    rule.states = input.states;
  }
  if (rule.cities !== input.cities) {
    console.log(`Updating rule cities:`, cities);
    rule.cities = input.cities;
  }
  if (rule.zipCodes !== input.zipCodes) {
    console.log(`Updating rule zipCodes:`, zipCodes);
    rule.zipCodes = input.zipCodes;
  }
  if (rule.lists !== input.lists) {
    console.log(`Updating rule lists:`, lists);
    rule.lists = input.lists;
  }
  if (rule !== xRule) {
    console.log("Changes found in update attempt");
  }
}

async function syncRules(req_id) {
  console.log(`Synchronizing Rules...`.blue.bold);
  let results = [];
  const rules = await RuleData.find();
  console.log(`Rules found:`, rules.length);
  for (let i = 0; i < rules.length; i++) {
    const result = await synchronizeRule(req_id, rules[i].id);
    results.push(result);
  }
  return results;
}

async function synchronizeRule(req_id, rule_id) {
  let result = {
    rule_id,
    name: null,
    updated: false,
  };
  const rule = await RuleData.findOne({ id: rule_id });
  console.log(`Synchronizing:`, rule.name);
  const xRule = rule;
  const {
    id,
    name,
    range,
    type,
    targeted_areas,
    states,
    cities,
    zipCodes,
    targeted_lists,
    targeted_skus,
    skus,
  } = rule;
  if (rule.skus !== targeted_skus) {
    rule.skus = targeted_skus;
  }
  if (rule.states !== targeted_areas) {
    rule.states = targeted_areas;
  }
  if (rule.lists !== targeted_lists) {
    rule.lists = targeted_lists;
  }
  if (xRule !== rule) {
    const saved = await rule.save();
    console.log(`Updated Rule!`.green);
    result.updated = true;
  }

  return result;
}

module.exports = {
  processRules,
  updateRule,
  syncRules,
};
