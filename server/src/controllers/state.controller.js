const StateData = require("../models/state.model");
const colors = require("colors");
const { v4: uuidv4 } = require("uuid");
const State = require("../models/state.model");

async function createState(req_id, input) {
  console.log(`[${req_id}] Creating State:`.blue, input.name);
  let state = {
    name: input.name,
    code: input.code,
    status: input.status ? input.status : "disabled",
  };
  try {
    const new_state = await StateData.create(state);
    console.log(
      `[${req_id}] State created successfully:`.green,
      new_state.code
    );

    return new_state;
  } catch (error) {
    return error;
  }
}
async function updateState(req_id, stateCode, input) {
  console.log(`[${req_id}] Updating State:`.blue, stateCode);
  const xState = input;
  const state = await StateData.findOne({ code: xState.code });
  let updated = [];
  if (state.name !== input.name) {
    console.log(`[${req_id}] Change detected:`, `name`);
    state.name = input.name;
    updated.push("name");
  }
  if (state.status !== input.status) {
    console.log(`[${req_id}] Change detected:`, `status`);
    state.status = input.status;
    updated.push("status");
  }
  if (state.rules !== input.rules) {
    console.log(`[${req_id}] Change detected:`, `rules`);
    state.rules = input.rules;
    updated.push("rules");
  }
  if (state.zipCodes !== input.zipCodes) {
    console.log(`[${req_id}] Change detected:`, `zipCodes`);
    state.zipCodes = input.zipCodes;
    updated.push("zipCodes");
  }
  if (xState !== state) {
    const saved = await state.save();
    console.log(`[${req_id}] State Updated:`.green.bold, stateCode);
    return { updated, saved };
  } else {
    return { updated, state };
  }
}
async function deleteState(req_id, stateCode) {
  console.log(`[${req_id}] Deleting State:`.blue, stateCode);
  try {
    await StateData.deleteOne({ code: stateCode });
    console.log(`[${req_id}] State deleted successfully:`.green, stateCode);
    return { message: "State deleted" };
  } catch (error) {
    return error;
  }
}
async function getStateByCode(req_id, stateCode) {
  console.log(`[${req_id}] Retreiving State:`.blue, stateCode);
  try {
    const state = await StateData.findOne({ code: stateCode });
    return state;
  } catch (error) {
    return error;
  }
}
async function getAllStates(req_id) {
  console.log(`[${req_id}] Retreiving all States`.blue);
  try {
    const states = await StateData.find();
    return states;
  } catch (error) {
    return error;
  }
}
module.exports = {
  createState,
  updateState,
  deleteState,
  getStateByCode,
  getAllStates,
};
