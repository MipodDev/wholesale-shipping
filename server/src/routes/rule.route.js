const express = require("express");
const router = express.Router();
const colors = require("colors");
const { v4: uuidv4 } = require("uuid");
const {
  createRule,
  updateRule,
  deleteRule,
  getRuleById,
  getAllRules,
} = require("../controllers/rule.controller");
const {
  synchronizeAllRules,
  synchronizeOneRule,
} = require("../services/rule.service");

router.get("/", async (req, res) => {
  const req_id = uuidv4();
  try {
    const data = await getAllRules(req_id);
    res.status(200).send(data);
  } catch (error) {
    res.status(405).send(error);
  }
});

router.get("/:id", async (req, res) => {
  const req_id = uuidv4();
  const object_id = req.params.id;
  try {
    const data = await getRuleById(req_id, object_id);
    res.status(200).send(data);
  } catch (error) {
    res.status(405).send(error);
  }
});

router.post("/", async (req, res) => {
  const req_id = uuidv4();
  const input = req.body;
  try {
    const new_rule = await createRule(req_id, input);
    res.status(200).send(new_rule);
  } catch (error) {
    res.status(405).send(error);
  }
});

router.patch("/:id", async (req, res) => {
  const req_id = uuidv4();
  const object_id = req.params.id;
  const input = req.body;
  try {
    const updated_rule = await updateRule(req_id, object_id, input);
    res.status(200).send(updated_rule);
  } catch (error) {
    res.status(405).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  const req_id = uuidv4();
  const object_id = req.params.id;

  try {
    const data = await deleteRule(req_id, object_id);
    res.status(200).send(data);
  } catch (error) {
    res.status(405).send(error);
  }
});

router.post("/synchronize", async (req, res) => {
  const req_id = uuidv4();
  try {
    const response = await synchronizeAllRules(req_id);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});

router.post("/synchronize/:id", async (req, res) => {
  const req_id = uuidv4();
  const list_id = req.params.id;
  try {
    const response = await synchronizeOneRule(req_id, list_id);
    let message = null;
    if (response) {
      message = "Rule was updated succesfully";
    } else {
      message = "No changes were made";
    }
    res.status(200).send({message});
  } catch (error) {
    res.status(405).send(error);
  }
});
module.exports = router;
