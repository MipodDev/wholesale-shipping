const RequestLogs = require("../models/requestLoq.model");
const customerData = require("../models/customer.model");

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
  
  const request_log = {
    req_id,
    site,
    customer_detected,
    customer,
    request: rate_request,
    response: { rates, rules_applied },
    rules_applied: [],
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
    let data = await customerData.findOne({
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

module.exports = { getRates };
