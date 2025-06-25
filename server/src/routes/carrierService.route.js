const express = require("express");
const router = express.Router();
const colors = require("colors");
const {
  synchronizeAllServices,
  synchronizeOneService,
} = require("../services/carrierService.service");
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/carrierService.controller.js");
const { v4: uuidv4 } = require("uuid");
const { updateLog } = require("../services/sync.service");

router.post("/synchronize", async (req, res) => {
  const req_id = uuidv4();
  try {
    const response = await synchronizeAllServices(req_id);
    await updateLog({ table: "Services", status: "Success" });

    res.status(200).send(response);
  } catch (error) {
    await updateLog({ table: "Services", status: "Failed" });

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

router.get("/", async (req, res) => {
  const req_id = uuidv4();
  try {
    const response = await getAllServices(req_id);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});
router.get("/:id", async (req, res) => {
  const req_id = uuidv4();
  const service_id = req.params.id;

  try {
    const response = await getServiceById(req_id, service_id);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});
router.post("/", async (req, res) => {
  const req_id = uuidv4();
  const input = req.body;
  try {
    const response = await createService(req_id, input);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});
router.patch("/:id", async (req, res) => {
  const req_id = uuidv4();
  const service_id = req.params.id;

  const input = req.body;
  try {
    const response = await updateService(req_id, service_id, input);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});
router.delete("/:id", async (req, res) => {
  const req_id = uuidv4();
  const service_id = req.params.id;

  try {
    const response = await deleteService(req_id, service_id);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});

module.exports = router;
