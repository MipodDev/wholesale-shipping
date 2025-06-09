const RuleData = require("../models/rule.model");
const { v4: uuidv4 } = require("uuid");
const colors = require("colors");
const StateData = require("../models/state.model");
const listData = require("../models/list.model");

async function synchronizeAllRules(req_id) {
  let response = {
    req_id,
    results: []
  }
  console.log(`[${req_id}] Synchronizing All Rules...`.cyan.bold);
  const rules = await RuleData.find().select("id");
  console.log(`[${req_id}] Rules Found:`.green.bold, rules.length);
  for (let i = 0; i < rules.length; i++) {
    
      try {

    const sync = await synchronizeOneRule(req_id, rules[i].id);
   
    response.results.push(sync);
      } catch (error) {
    console.log(error);
  }

  }
  return response;
}

async function synchronizeOneRule(req_id, rule_id) {
  let sync = {
    req_id,
    rule_id,
    updates: 0,
    errors: [],
  };
  console.log(`\n[${req_id}] Synchronizing Rule:`.blue.bold, rule_id);

  const rule = await RuleData.findOne({ id: rule_id });

  console.log(`[${req_id}] List(s) assigned to Rule:`.blue, rule.lists.length);
  try {
    if (rule.lists.length > 0) {
      for (let i = 0; i < rule.lists.length; i++) {
        const list = rule.lists[i];
        const skus = await getListDetail(req_id, list.id);
        for (let sku of skus) {
          if (!rule.skus.includes(sku)) {
            rule.skus.push(sku);
            sync.updates++;
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
  if (sync.updates > 0) {
    const saved = await rule.save();
    console.log(`[${req_id}] Saved updates to Rule:`.green, saved.name);
  } else {
    console.log(`[${req_id}] No updates made to Rule:`.yellow, rule.name);
  }

  return sync;
}

async function getListDetail(req_id, list_id) {
  try {
    const list = await listData.findOne({ id: list_id }).select("name skus");
    const { name, skus } = list;
    console.log(
      `[${req_id}] Skus assigned to List (${name}):`.green,
      skus.length
    );
    return skus;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  synchronizeAllRules,
  synchronizeOneRule,
};
