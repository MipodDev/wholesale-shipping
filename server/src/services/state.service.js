const stateData = require("../models/state.model");
const ruleData = require("../models/rule.model");
const serviceData = require("../models/service.model");

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
    try {
      const result = await synchronizeState(req_id, code);
      response.results.push(result);
    } catch (error) {
      response.errors.push(error);
    }
  }
  return response;
}

async function synchronizeState(req_id, stateCode) {
  let result = {
    status: "Initialized",
    state: stateCode,
    changes: [],
    errors: [],
  };

  let state = await stateData.findOne({ code: stateCode });

  const xState = state;
  console.log(`[${req_id}] Synchronizing State:`.blue, state.name);

  // Add to State.Rules : [{id,name,range,type,cities,zipCodes,lists}]
  const xRules = state.rules;
  try {
    state.rules = await findRelatedRules(req_id, stateCode);
    if (xRules !== state.rules) {
      console.log(`Rules Updated!`.green.bold);
      result.changes.push("Rules Updated");
    }
  } catch (error) {
    result.errors.push(error);
    result.status = "Failed";
    console.error(error);
    return result;
  }

  //   Add to State.Services
  const xServices = state.services;
  try {
    state.services = await findRelatedServices(req_id, stateCode);

    if (xServices !== state.services) {
      console.log(`Services Updated!`.green.bold);
      result.changes.push("Services Updated");
    }
  } catch (error) {
    result.errors.push(error);
    result.status = "Failed";
    console.error(error);
    return result;
  }

  //   Add to State.zipCodes
  const xZipCodes = state.zipCodes;
  try {
    state.zipCodes = await findRelatedZipCodes(req_id, stateCode);
    if (xZipCodes !== state.zipCodes) {
      console.log(`Zip Codes Updated!`.green.bold);
      result.changes.push("Zip Codes Updated");
    }
  } catch (error) {
    result.errors.push(error);
    result.status = "Failed";
    console.error(error);
    return result;
  }

  if (result.changes.length > 0) {
    try {
      const saved = await state.save();

      console.log(
        `Updates made to:`.yellow.bold,
        `(${saved.name}) ${result.changes}`
      );
    } catch (error) {
      result.errors.push(error);
      result.status = "Failed";
      console.error(error);
      return result;
    }
  }

  return result;
}

async function findRelatedRules(req_id, stateCode) {
  let rules = [];
  const rel_rules = await ruleData.find({ "states.code": stateCode });
  console.log(`[${req_id}] Related Rules:`.blue, rel_rules.length);
  if (rel_rules.length > 0) {
    for (let i = 0; i < rel_rules.length; i++) {
      const { id, name, range, type, lists } = rel_rules[i];

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

async function findRelatedZipCodes(req_id, stateCode) {
  return [];
}

module.exports = { synchronizeStates, synchronizeState };
