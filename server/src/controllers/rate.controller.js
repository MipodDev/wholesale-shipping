const RequestLogs = require("../models/requestLoq.model");
const CustomerData = require("../models/customer.model");
const StateData = require("../models/state.model");
const ServiceData = require("../models/service.model");

async function getRates(req_id, site, rate_request) {
  const { origin, destination, items, currency, locale } = rate_request;
  let rates = [];
  let rules_applied = [];
  let customer_detected = false;

  // Retrieve Customer Details

  const customer = await getCustomerDetail(req_id, site, rate_request);
  if (customer) {
    customer_detected = true;
    if (customer.ruleSets.length > 1) {
      rules_applied = [...customer.ruleSets];
    }
  }
  const destinationDetail = await getDestinationDetail(
    req_id,
    site,
    destination
  );
  if (!destinationDetail) {
    throw new Error("Destination not mapped");
  } else {
    if (destinationDetail.rules.length > 0) {
      rules_applied = [...destinationDetail.rules];
      console.log(destinationDetail.rules);
    }
  }

  const approval = await getApproval(
    req_id,
    site,
    rules_applied,
    destinationDetail,
    items
  );

  if (approval) {
    const services = await getServices(req_id, destinationDetail);
  }

  const request_log = {
    req_id,
    site,
    customer_detected,
    customer,
    destinationDetail,
    // request: rate_request,
    rates,
    rules_applied,
  };

  console.log(`${req_id}] Rate Response:`.blue.bold, request_log);

  return rates;
}

async function getCustomerDetail(req_id, site, rate_request) {
  let customer = {
    id: null,
    email: null,
    phone: null,
    ruleSets: null,
    site: null,
  };
  const destination = rate_request.destination;
  const normalizedPhone = destination.phone?.replace(/\D/g, ""); // Strip all non-numeric chars, e.g., "(480) 252-4808" -> "4802524808"
  try {
    let data = await CustomerData.findOne({
      site,
      phone: { $regex: `${normalizedPhone}$` }, // Ends with normalized phone
    });
    customer.id = data.id;
    customer.email = data.email;
    customer.phone = data.phone;
    customer.ruleSets = data.ruleSets;
    customer.site = data.site;

    console.log(`[${req_id}] Retreived Customer Record:`.green, customer.email);
  } catch (error) {
    console.log(`${req_id}] Error retreiving customer:`.red, error);
    customer = null;
  }
  return customer;
}

async function getDestinationDetail(req_id, site, destination) {
  console.log(`[${req_id}] Searching for Destination detail for...`);
  let detail = {
    name: null,
    code: null,
    status: null,
    zipCode: null,
    city: null,
    rules: [],
  };
  try {
    const state = await StateData.findOne({
      code: destination.province,
    });
    detail.name = state.name;
    detail.code = state.code;
    detail.status = state.status;
    detail.rules = state.rules;
    detail.city = destination.city;
    detail.zipCode = destination.postal_code;
    console.log(`[${req_id}] Retreived State:`, state.name);
  } catch (error) {
    console.log(`Error finding destination detail:`, error);
    detail = null;
  }
  return detail;
}

async function getApproval(
  req_id,
  site,
  rules_applied,
  destinationDetail,
  items
) {
  console.log(`[${req_id}] Getting Approval...`.yellow);
  let approval = {
    status: true,
    reason: "none",
  };
  for (let rule of rules_applied) {
    let target_location = false;

    const { name, range, type, targeted_lists } = rule;
    console.log(`- Processing Rule:`, name);
    console.log(`- Rule Type:`, `${type} (${range})`);
    switch (range) {
      case "State":
        target_location = true;
        break;
      case "City":

        break;
      case "Zip Code":
        break;
      case "Customer":
        break;
    }
    if(target_location){
      console.log(`- Location is targeted!`);
    }
  }

  return approval;
}

async function getServices(req_id, destinationDetail) {}

module.exports = { getRates };
