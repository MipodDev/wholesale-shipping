const RequestLogs = require("../models/requestLoq.model");
const customerData = require("../models/customer.model");

async function getRates(req_id, site, rate_request) {
  const { origin, destination, items, currency, locale } = rate_request;
  let rates = [];
  let rules_applied = [];


  // get customer
  console.log(items);

  const {
    country,
    postal_code,
    province,
    city,
    name,
    address1,
    address2,
    address3,
    latitude,
    longitude,
    phone,
    fax,
    email,
    address_type,
    company_name,
  } = destination;

const normalizedPhone = phone?.replace(/\D/g, ""); // Strip all non-numeric chars, e.g., "(480) 252-4808" -> "4802524808"

const customer = await customerData.findOne({
  site,
  phone: { $regex: `${normalizedPhone}$` }, // Ends with normalized phone
});

if (customer) {
  console.log(`Found Customer:`, customer);
} else {
  console.log(`Customer not found:`, destination.phone);
}

  //   {
  //   country: 'US',
  //   postal_code: '85008',
  //   province: 'AZ',
  //   city: 'Phoenix',
  //   name: 'Dylan Walters',
  //   address1: '4908 East McDowell Road',
  //   address2: null,
  //   address3: null,
  //   latitude: null,
  //   longitude: null,
  //   phone: '4802524808',
  //   fax: null,
  //   email: null,
  //   address_type: null,
  //   company_name: null
  // }

  // get available zones

  // get restrictions/exemptions by customer
  const request_log = {
    req_id,
    site,
    request: rate_request,
    response: { rates, rules_applied },
    rules_applied: [],
  };

  return rates;
}

module.exports = { getRates };
