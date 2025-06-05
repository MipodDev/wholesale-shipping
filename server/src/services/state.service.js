const stateData = require("../models/state.model");
const ruleData = require("../models/rule.model");

async function synchronizeStates(req_id) {
  let response = {
    status: "Initialized",
    results: [],
    errors: [],
  };
  console.log(`[${req_id}] Bulk State Synchronization initiated...`.blue.bold);

  const states = await stateData.find();
  for (let i = 0; i < states.length; i++) {
    const { code } = states[i];
    const result = await synchronizeState(req_id, code);
    response.results.push(result);
  }
  return response;
}

async function synchronizeState(req_id, stateCode, state = null) {
  let result = {
    status: "Initialized",
    state: stateCode,
    changes: [],
    errors: [],
  };
  if (!state) {
    state = await stateData.findOne({ code: stateCode });
  }

  const xState = state;
  console.log(`[${req_id}] Synchronizing State:`.blue, state.name);

  // Add to State.Rules : [{id,name,range,type,cities,zipCodes,lists}]
  try {
    state.rules = await findRelatedRules(stateCode);
    if (xState.rules !== state.rules) {
      console.log(`Rules Updated!`.green.bold);
      result.changes.push("Rules Updated");
    }
  } catch (error) {
    result.errors.push(error);
    console.error(error);
  }

  //   Add to State.Services
  try {
    state.services = await findRelatedServices(req_id, stateCode);
    if (xState.services !== state.services) {
      console.log(`Services Updated!`.green.bold);
      result.changes.push("Services Updated");
    }
  } catch (error) {
    result.errors.push(error);
    console.error(error);
  }

  //   (WIP) Add a Zip Code Sync Method
  //   Add to State.zipCodes
  try {
    state.zipCodes = await findRelatedZipCodes(req_id, stateCode);
    if (xState.zipCodes !== state.zipCodes) {
      console.log(`Zip Codes Updated!`.green.bold);
      result.changes.push("Zip Codes Updated");
    }
  } catch (error) {
    result.errors.push(error);
    console.error(error);
  }

  if (xState !== state) {
    console.log(`Updates were made to:`.yellow.bold, stateCode);
  }

  return result;
}

async function findRelatedRules(req_id, stateCode) {
  let rules = [];
  const rel_rules = await ruleData.find({ states: stateCode });
  console.log(`[${req_id}] Related Rules:`.blue, rel_rules.length);
  if (rel_rules.length > 0) {
    for (let i = 0; i < rel_rules.length; i++) {
      const { id, name, range, type, cities, lists, skus, states, zipCodes } =
        rel_rules[i];

      const rule = {
        id,
        name,
        range,
        type,
        lists,
      };
      rules.push(rule);
    }
  }
  return rules;
}

async function findRelatedServices(req_id, stateCode) {
  let services = [];

  const rel_services = await serviceData.find({ provinces: stateCode });
  console.log(`[${req_id}] Related services:`.blue, rel_services.length);
  if (rel_services.length > 0) {
    for (let i = 0; i < rel_services.length; i++) {
      const { id, name, description } = rel_services[i];
      services.push({
        id,
        name,
        description,
      });
    }
  }
  return services;
}

async function findRelatedZipCodes(req_id, stateCode){
    return [];
}

module.exports = { synchronizeStates, synchronizeState };
