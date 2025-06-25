const express = require("express");
const router = express.Router();
const colors = require("colors");
const { v4: uuidv4 } = require("uuid");
const {
  synchronizeLists,
  synchronizeOneList,
} = require("../services/list.service");
const {
  createList,
  updateList,
  deleteList,
  getListById,
  getAllLists,
} = require("../controllers/list.controller");
const { updateLog } = require("../services/sync.service");

router.get("/", async (req, res) => {
  const req_id = uuidv4();
  try {
    const response = await getAllLists(req_id);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});
router.get("/:id", async (req, res) => {
  const req_id = uuidv4();
  const list_id = req.params.id;

  try {
    const response = await getListById(req_id, list_id);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});
router.post("/", async (req, res) => {
  const req_id = uuidv4();
  const input = req.body;
  try {
    const response = await createList(req_id, input);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});
router.patch("/:id", async (req, res) => {
  const req_id = uuidv4();
  const list_id = req.params.id;

  const input = req.body;
  try {
    const response = await updateList(req_id, list_id, input);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});
router.delete("/:id", async (req, res) => {
  const req_id = uuidv4();
  const list_id = req.params.id;

  try {
    const response = await deleteList(req_id, list_id);
    res.status(200).send(response);
  } catch (error) {
    res.status(405).send(error);
  }
});

router.post("/synchronize", async (req, res) => {
  const req_id = uuidv4();
  try {
    const response = await synchronizeLists(req_id);
    await updateLog({ table: "Product Lists", status: "Success" });

    res.status(200).send(response);
  } catch (error) {
    await updateLog({ table: "Product Lists", status: "Failed" });

    res.status(405).send(error);
  }
});

router.post("/synchronize/:id", async (req, res) => {
  const req_id = uuidv4();
  const list_id = req.params.id;
  try {
    const response = await synchronizeOneList(req_id, list_id);
    let message = null;
    if (response) {
      message = "List was updated succesfully";
    } else {
      message = "No changes were made";
    }
    res.status(200).send({ message });
  } catch (error) {
    res.status(405).send(error);
  }
});

module.exports = router;
