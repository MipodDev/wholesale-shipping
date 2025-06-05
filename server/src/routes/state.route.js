const express = require("express");
const router = express.Router();
const {
  createState,
  updateState,
  deleteState,
  getStateByCode,
  getAllStates,
} = require("../controllers/state.controller");

router.get("/", async (req, res) => {
  const req_id = uuidv4();
  try {
    const response = await getAllStates(req_id);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});

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

module.exports = router;
