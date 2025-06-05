const ServiceData = require("../models/service.model");
const StateData = require("../models/state.model");

async function synchronizeServices(req_id) {
  console.log(`[${req_id}] Synchronizing Services...`.blue.bold);
  const services = await ServiceData.find();
  console.log(`[${req_id}] Found Services:`.green.bold, services.length);
  for (let i = 0; i < services.length; i++) {
    await synchronizeService(req_id, services[i].id);
  }
}

async function synchronizeService(req_id, service_id) {
  const service = await ServiceData.findOne({ id: service_id });
  const { name, description, provinces, for_zips, zipCodes, mapped_carrier } =
    service;
  console.log(`[${req_id}] Synchronizing:`, name);

  // Add to State.Services : {
  //   id: service.id,
  //   name: service.id,
  //   zipCodes: service.zipCodes.length
  //}
  // for (let i = 0; i < provinces.length; i++) {
  //   const state = await StateData.findOne({code: provinces[i]});
  //   console.log(`[${req_id}] Applying to State:`, state.name);

  // If Mapped Carrier, Add to ZipCodes & Service.zipCodes : [
  // {
  //   stateCode: BC.getZips[?].state,
  //   code: BC.getZips[?].code,
  //   county: ?tbd,
  // }
  //]
  // }
}

module.exports = {
  synchronizeServices,
};
