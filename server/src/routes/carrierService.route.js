const express = require("express");
const router = express.Router();
const colors = require("colors");
const {
  synchronizeAllServices,
  synchronizeOneService,
} = require("../services/carrierService.service");

const { v4: uuidv4 } = require("uuid");

router.post("/synchronize", async (req, res) => {
  const req_id = uuidv4();
  try {
    const response = await synchronizeAllServices(req_id);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});

router.post("/synchronize/:id", async (req, res) => {
  const req_id = uuidv4();
  const service_id = req.params.id;

  try {
    const response = await synchronizeOneService(req_id, service_id);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});

module.exports = router;
