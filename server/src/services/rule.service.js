const RuleData = require("../models/rule.model");
const { v4: uuidv4 } = require("uuid");
const colors = require("colors");
const StateData = require("../models/state.model");

async function processRules() {
  const rules = await RuleData.find();
  console.log(`Rules found:`.blue.bold, rules.length);
  for (let i = 0; i < rules.length; i++) {
    const rule = await RuleData.findOne({
      name: rules[i].name,
    });

    if (!rule.id) {
      console.log(`Updating ID for Rule:`.yellow, rule.name);

      rule.id = uuidv4();
      try {
        const saved = await rule.save();
        console.log(`Updated Mongo Record!`.green);
      } catch (error) {
        console.log(`Failed to update Mongo Record:`.red, error);
      }
    }
    if (!rule.range) {
      console.log(`Updating Range for Rule:`.yellow, rule.name);

      rule.range = "State";
      try {
        const saved = await rule.save();
        console.log(`Updated Mongo Record!`.green);
      } catch (error) {
        console.log(`Failed to update Mongo Record:`.red, error);
      }
    }
    if (!rule.type) {
      console.log(`Updating type for Rule:`.yellow, rule.name);

      rule.type = "Ban";
      try {
        const saved = await rule.save();
        console.log(`Updated Mongo Record!`.green);
      } catch (error) {
        console.log(`Failed to update Mongo Record:`.red, error);
      }
    }

    const { id, name, targeted_skus, targeted_areas, targeted_lists, type, range } =
      rule;
    console.log(`Rule:`.magenta.bold, name);
    console.log(`Total SKUs Targeted:`.magenta, targeted_skus.length);
    console.log(`Target Areas:`.magenta);
    for (let state of targeted_areas) {
      console.log(`- ${state}`.blue);

      const existing_state = await StateData.findOne({ code: state });
      console.log(`Updating:`, existing_state.name);
      if (!existing_state.rules) {
          existing_state.rules = [];
        console.log(`Adding Rule...`.green);

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
      console.log(`Updated mongo record...`.green.bold)
    }
    console.log(`Target Lists:`.magenta);
    for (let list of targeted_lists) {
      console.log(`- ${list.name} (${list.category})`.blue);
    }
  }
}

module.exports = {
  processRules,
};
