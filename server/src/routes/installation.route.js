const express = require("express");
const router = express.Router();
const colors = require("colors");
const {
  getAllInstalledServices,
  checkInstalledService,
  updateInstalledService,
  installService,
} = require("../services/installation.service");

router.get("/:site", async (req, res) => {
  const site = req.params.site;
  const data = await getAllInstalledServices(site);

  res.send(data);
});

router.post("/check/:site", async (req, res) => {
  const site = req.params.site;
  const response = await checkInstalledService(site);
  res.send(response);
});

router.post("/:site", async (req, res) => {
  const site = req.params.site;
  const input = req.body;
  try {
    const response = await installService(site, input);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ message: "Failed to create carrier service" });
  }
});

router.patch("/:site", async (req, res) => {
  const site = req.params.site;
  const input = req.body;
  try {
    const response = await updateInstalledService(site, input);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ message: "Failed to create carrier service" });
  }
});

module.exports = router;
