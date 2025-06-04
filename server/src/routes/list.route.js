const express = require("express");
const router = express.Router();
const colors = require("colors");
const { processLists } = require("../services/list.service");

router.post("/process", async (req, res) => {
  res.send("Request Received to Process Lists.");
  (async () => {
    try {
      await processLists();
    } catch (error) {
      console.error(error);
    }
  })();
});

router.get("/", async (req, res) => {
  const req_id = uuidv4();
});
router.get("/:id", async (req, res) => {
  const req_id = uuidv4();
});
router.post("/:id", async (req, res) => {
  const req_id = uuidv4();
});
router.patch("/:id", async (req, res) => {
  const req_id = uuidv4();
});
router.delete("/:id", async (req, res) => {
  const req_id = uuidv4();
});

module.exports = router;
