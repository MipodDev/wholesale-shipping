const ServiceData = require("../models/service.model");

async function getAllServices(req_id) {
  console.log(`[${req_id}] Retreiving All Carrier Services`.blue.bold);
  const services = await ServiceData.find();
  console.log(
    `[${req_id}] Carrier Services retreived:`.green.bold,
    services.length
  );

  return services;
}
async function createService(req_id, input) {
  console.log(`[${req_id}] Creating a Carrier Service`.blue.bold);

  const new_service = await ServiceData.create(input);
  console.log(
    `[${req_id}] Carrier Service created:`.green.bold,
    new_service.name
  );

  return new_service;
}
async function getServiceById(req_id, service_id) {
  console.log(
    `[${req_id}] Retreiving one Carrier Service`.blue.bold,
    service_id
  );

  const service = await ServiceData.findOne({ id: service_id });
  console.log(
    `[${req_id}] Carrier Service Retreived:`.green.bold,
    service.name
  );

  return service;
}
async function updateService(req_id, service_id, input) {
  console.log(`[${req_id}] Updating Carrier Service`.blue.bold, service_id);

  const service = await ServiceData.findOne({ id: service_id });
  let updated = false;
  try {
    if (input.name && input.name !== service.name) {
      updated = true;
      service.name = input.name;
    }
    if (input.description && input.description !== service.description) {
      updated = true;
      service.description = input.description;
    }
    if (input.provinces && input.provinces !== service.provinces) {
      updated = true;
      service.provinces = input.provinces;
    }
    if (
      input.minimum_order_value &&
      input.minimum_order_value !== service.minimum_order_value
    ) {
      updated = true;
      service.minimum_order_value = input.minimum_order_value;
    }
    if (input.price && input.price !== service.price) {
      updated = true;
      service.price = input.price;
    }
    if (
      input.free_shipping_threshold &&
      input.free_shipping_threshold !== service.free_shipping_threshold
    ) {
      updated = true;
      service.free_shipping_threshold = input.free_shipping_threshold;
    }
    if (
      input.per_box_value_set &&
      input.per_box_value_set !== service.per_box_value_set
    ) {
      updated = true;
      service.per_box_value_set = input.per_box_value_set;
    }
    if (input.service_name && input.service_name !== service.service_name) {
      updated = true;
      service.service_name = input.service_name;
    }
    if (input.service_code && input.service_code !== service.service_code) {
      updated = true;
      service.service_code = input.service_code;
    }
    if (input.for_zips && input.for_zips !== service.for_zips) {
      updated = true;
      service.for_zips = input.for_zips;
    }
    if (input.zipCodes && input.zipCodes !== service.zipCodes) {
      updated = true;
      service.zipCodes = input.zipCodes;
    }
    if (
      input.mapped_carrier &&
      input.mapped_carrier !== service.mapped_carrier
    ) {
      updated = true;
      service.mapped_carrier = input.mapped_carrier;
    }
  } catch (error) {
    console.error(error);
  }

  if (updated) {
    const saved = await service.save();
    console.log(`[${req_id}] Carrier Service Updated:`.green.bold, saved.name);

    return saved;
  } else {
    console.log(`[${req_id}] No Changes made:`.yellow.bold, service.name);
    return service;
  }
}
async function deleteService(req_id, service_id) {
  console.log(`[${req_id}] Deleting Carrier Service`.blue.bold, service_id);

  try {
    await ServiceData.delete({ id: service_id });
    console.log(`[${req_id}] Carrier Service Deleted:`.red.bold, service_id);

    return true;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
