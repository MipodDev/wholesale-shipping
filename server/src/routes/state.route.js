const express = require("express");
const router = express.Router();
const {
  createState,
  updateState,
  deleteState,
  getStateByCode,
  getAllStates,
} = require("../controllers/state.controller");
const {
  synchronizeStates,
  synchronizeState,
} = require("../services/state.service");
const { v4: uuidv4 } = require("uuid");
const { updateLog } = require("../services/sync.service");

// Get All States
router.get("/", async (req, res) => {
  const req_id = uuidv4();
  try {
    const response = await getAllStates(req_id);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});

// Get State by State Code
router.get("/:stateCode", async (req, res) => {
  const req_id = uuidv4();
  const stateCode = req.params.stateCode;
  try {
    const state = await getStateByCode(req_id, stateCode);
    res.status(200).send(state);
  } catch (error) {
    res.status(405).send(error);
  }
});

// Create a State
router.post("/", async (req, res) => {
  const req_id = uuidv4();
  const input = req.body;
  try {
    const state = await createState(req_id, input);
    res.status(200).send(state);
  } catch (error) {
    res.status(405).send(error);
  }
});

// Update State by Code
router.patch("/:stateCode", async (req, res) => {
  const req_id = uuidv4();
  const stateCode = req.params.stateCode;
  const input = req.body;

  try {
    const state = await updateState(req_id, stateCode, input);
    res.status(200).send(state);
  } catch (error) {
    res.status(405).send(error);
  }
});

// Delete State by Code
router.delete("/:stateCode", async (req, res) => {
  const req_id = uuidv4();
  const stateCode = req.params.stateCode;
  try {
    const response = await deleteState(req_id, stateCode);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});

// Synchronize all States (Rules, Services, Zip Codes)
router.post("/synchronize", async (req, res) => {
  const req_id = uuidv4();
  try {
    const response = await synchronizeStates(req_id);
    await updateLog({ table: "States", status: "Success" });

    res.status(200).send(response);
  } catch (error) {
    await updateLog({ table: "States", status: "Failed" });

    res.status(405).send(error);
  }
});

// Synchornize one State by Code (Rules, Services, Zip Codes)
router.post("/synchronize/:stateCode", async (req, res) => {
  const req_id = uuidv4();

  const stateCode = req.params.stateCode;
  try {
    const response = await synchronizeState(req_id, stateCode);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});

module.exports = router;
