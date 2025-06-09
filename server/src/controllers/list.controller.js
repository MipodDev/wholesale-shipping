const ListData = require("../models/list.model");
const colors = require("colors");
const { v4: uuidv4 } = require("uuid");

async function createList(req_id, input) {
  console.log(`[${req_id}] Creating list:`.blue, input.name);

  try {
    const new_list = {
      id: uuidv4(),
      name: input.name,
      category: input.category ? input.category : "",
      include: input.include ? input.include : [],
      exclude: input.exclude ? input.exclude : [],
    };

    try {
      const created = await ListData.create(new_list);
      console.log(`[${req_id}] List created successfully:`.green, new_list.id);
      // Process a single rule, to attach listed products & assigned states
      return created;
    } catch (error) {
      return error;
    }
  } catch (error) {
    console.log(error);
  }
}
async function updateList(req_id, object_id, input) {
  console.log(`[${req_id}] Updating list:`.blue, object_id);
  try {
    const existing = await ListData.findOne({ id: object_id });
    // update values
    const saved = await existing.save();
    console.log(`[${req_id}] Updated list:`.green.bold, object_id);
    return saved;
  } catch (error) {
    return error;
  }
}

async function deleteList(req_id, object_id) {
  console.log(`[${req_id}] Deleting list:`.blue, object_id);
  try {
    await ListData.deleteOne({ id: object_id });
    console.log(`[${req_id}] List deleted successfully`.green);
    // Process all Lists, removing List from affected states
    return { message: "List deleted" };
  } catch (error) {
    return error;
  }
}

async function getListById(req_id, object_id) {
  console.log(`[${req_id}] Retreiving list:`.blue, object_id);
  try {
    const list = await ListData.findOne({ id: object_id });
    return list;
  } catch (error) {
    return error;
  }
}

async function getAllLists(req_id) {
  console.log(`[${req_id}] Retreiving all lists`.blue);
  try {
    const lists = await ListData.find().select("id name category include exclude");
    return lists;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createList,
  updateList,
  deleteList,
  getListById,
  getAllLists,
};
