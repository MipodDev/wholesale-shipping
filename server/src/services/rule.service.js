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

    const { id, name, targeted_skus, targeted_areas, targeted_lists, type, range } =
      rule;
    console.log(`[${req_id}] Rule:`.magenta.bold, name);
    console.log(`[${req_id}] Total SKUs Targeted:`.magenta, targeted_skus.length);
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

            existing_state.rules.push({ id, name, targeted_lists, type, range });
          }
        }
      } else {
        console.log(`Adding Rule...`.green);

        existing_state.rules.push({ id, name, targeted_lists, type, range });
      }

      const saved = await existing_state.save();
      console.log(`[${req_id}] Updated mongo record...`.green.bold)
    }
    console.log(`[${req_id}] Target Lists:`.magenta);
    for (let list of targeted_lists) {
      console.log(`- ${list.name} (${list.category})`.blue);
    }
  }
}

module.exports = {
  processRules,
};
