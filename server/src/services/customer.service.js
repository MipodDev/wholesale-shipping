const CustomerData = require("../models/customer.model");
const {
  retreiveCustomerData,
  deleteCustomer,
  customerCleanupQuery,
} = require("../graphql/customers");

async function synchronizeCustomers(req_id, site) {
  let customer_set = new Set();
  let rejected_customers = new Set();

  const first = 250;

  let filter = `first: ${first}`;
  let last_cursor = null;
  let processed = 0;

  while (true) {
    if (last_cursor) {
      console.log(`[${req_id}] Retreiving next ${first} customers (${processed})`);

      filter = `first: ${first}, after: "${last_cursor}"`;
    } else {
      console.log(`[${req_id}] Retreiving first ${first} customers...`);
    }
    const data = await retreiveCustomerData(site, filter);

    const customers = data.customers.edges;
    last_cursor = data.customers.pageInfo.endCursor;
    for (let i = 0; i < customers.length; i++) {
      const { node } = customers[i];
      // console.log(node);
      let customer = {
        id: node.id,
        email: node.defaultEmailAddress
          ? node.defaultEmailAddress.emailAddress
          : "",
        phone: node.defaultPhoneNumber
          ? node.defaultPhoneNumber.phoneNumber
          : "",
        numberOfOrders: node.numberOfOrders,
        site,
      };
      if (!node.defaultEmailAddress || !node.defaultPhoneNumber) {
        rejected_customers.add(customer);
      }

      customer_set.add(customer);

      processed++;
    }
    if (customers.length < first) {
      break;
    }
  }

  console.log(`[${req_id}] Processing Approved Customers...`);
  const update_customers = Array.from(customer_set);
  for(let i = 0; i < update_customers.length; i++) {
    const { id, email, phone } = update_customers[i];
    const existing = await CustomerData.findOne({ id });
    if (existing) {
      existing.email = email;
      existing.phone = phone;
      existing.site = site;
      const saved  = await existing.save();
      console.log(`[${req_id}] (${i + 1}/${update_customers.length}) Updated:`, saved.email)
    } else {
      CustomerData.create({ id, email, phone, site });
      console.log(`[${req_id}] (${i + 1}/${update_customers.length}) Created:`, email);
    }
  }
}

module.exports = { synchronizeCustomers };
