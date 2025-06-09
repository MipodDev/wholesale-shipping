const ServiceData = require("../models/service.model");
const StateData = require("../models/state.model");

async function synchronizeAllServices(req_id) {
  console.log(`[${req_id}] Synchronizing Services...`.blue.bold);
  const services = await ServiceData.find();
  console.log(`[${req_id}] Found Services:`.green.bold, services.length);
  for (let i = 0; i < services.length; i++) {
    await synchronizeOneService(req_id, services[i].id);
  }
}

async function synchronizeOneService(req_id, service_id) {
  const service = await ServiceData.findOne({ id: service_id });
  const { name, description, provinces, for_zips, zipCodes, mapped_carrier } =
    service;
  console.log(`[${req_id}] Synchronizing:`, name);


}

module.exports = {
  synchronizeAllServices,
  synchronizeOneService,
};
