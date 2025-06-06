const express = require("express");
const router = express.Router();
const colors = require("colors");
const {
  getAllInstalledServices,
  checkInstalledService,
  updateInstalledService,
  installService,
} = require("../services/installation.service");
const { v4: uuidv4 } = require("uuid");
const {
  synchronizeApplication,
} = require("../controllers/synchronization.controller");

router.get("/:site", async (req, res) => {
  const site = req.params.site;
  const req_id = uuidv4();

  const data = await getAllInstalledServices(req_id, site);

  res.send(data);
});

router.post("/synchronize/:site", async (req, res) => {
  const req_id = uuidv4();
  const site = req.params.site;

  try {
    const response = await synchronizeApplication(req_id, site);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});

router.post("/check/:site", async (req, res) => {
  const site = req.params.site;
  const req_id = uuidv4();

  const response = await checkInstalledService(req_id, site);
  res.send(response);
});

router.post("/:site", async (req, res) => {
  const site = req.params.site;
  const input = req.body;
  const req_id = uuidv4();

  try {
    const response = await installService(req_id, site, input);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ message: "Failed to create carrier service" });
  }
});

router.patch("/:site", async (req, res) => {
  const site = req.params.site;
  const input = req.body;
  const req_id = uuidv4();

  try {
    const response = await updateInstalledService(req_id, site, input);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ message: "Failed to create carrier service" });
  }
});

module.exports = router;
