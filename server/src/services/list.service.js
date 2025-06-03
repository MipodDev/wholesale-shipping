const ListData = require("../models/list.model");
const RuleData = require("../models/rule.model");
const { v4: uuidv4 } = require("uuid");
const colors = require("colors");

async function processLists() {
    
  const lists = await ListData.find();
  console.log("lists found:", lists.length);
  let totalupdates = 0;
    console.log(`Applying updates to lists...`.blue.bold);

  for (let i = 0; i < lists.length; i++) {
    let updates_found = 0;

    console.log(`Updating:`.yellow.bold, lists[i].name);

    if (!lists[i].id) {
      updates_found++;

      console.log(`Adding ID to List...`.yellow);
      lists[i].id = uuidv4();
    }
    if (updates_found > 0) {
      const saved = lists[i].save();
      console.log(`Updated:`.green.bold, lists[i].name);
    } else {
      console.log(`No updates found...`.yellow);
    }

    totalupdates += updates_found;
  }

  console.log(`Total Updates:`.blue.bold, totalupdates);
}
module.exports = {
  processLists,
};
