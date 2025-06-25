const Sync = require("../models/sync.model");

async function updateLog(input) {
  const { table, status } = input;
  console.log(`Updating Sync Record for:`, table);

  const existing = await Sync.findOne({ table });

  try {
    if (!existing) {
      console.log(`Creating new sync record for:`.yellow, table);
      await Sync.create(input);
    } else {
      console.log(`Retreived sync record for:`.blue, table);
      existing.status = status;
      await existing.save();
    }
    console.log(`Sync record saved succesfully!`.green);
  } catch (error) {
    console.log(`Failed to save sync record:`.red, error);
  }
}

module.exports = { updateLog };
