const CustomerData = require("../models/customer.model");
const {
  retreiveCustomerData,
  deleteCustomer,
  customerCleanupQuery,
} = require("../graphql/customers");

async function synchronizeCustomers() {
  let customer_set = new Set();
  let rejected_customers = new Set();

  const site = "B2B";
  const first = 250;

  let filter = `first: ${first}`;
  let last_cursor = null;
  let processed = 0;

  while (true) {
    if (last_cursor) {
      console.log(`Retreiving next ${first} customers (${processed})`);

      filter = `first: ${first}, after: "${last_cursor}"`;
    } else {
      console.log(`Retreiving first ${first} customers...`);
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
      };
      if (!node.defaultEmailAddress || !node.defaultPhoneNumber) {
        rejected_customers.add(customer);
      } else {
        customer_set.add(customer);
      }
      processed++;
    }
    if (customers.length < first) {
      break;
    }
  }

  // const carrierServices = data.carrierServices.edges;
  // for (let i = 0; i < carrierServices.length; i++) {
  //   console.log(carrierServices[i]);
  // }
  const posPercent =
    (customer_set.size / (customer_set.size + rejected_customers.size)) * 100;
  const negPercent =
    (rejected_customers.size / (customer_set.size + rejected_customers.size)) *
    100;
  console.log(`Valid Customers:`, customer_set.size, `(${posPercent}%)`);
  console.log(
    `Invalid Customers:`,
    rejected_customers.size,
    `(${negPercent}%)`
  );
  for (let customer of Array.from(customer_set)) {
    const { id, email, phone } = customer;
    const existing = CustomerData.findOne({ id });
    if (existing) {
      CustomerData.updateOne(existing["_id"], { id, email, phone });
    } else {
      CustomerData.create({ id, email, phone });
    }
  }
  for (let customer of Array.from(rejected_customers)) {
    const { id, email, phone } = customer;
    const existing = CustomerData.findOne({ id });
    if (existing) {
      CustomerData.updateOne(existing["_id"], { id, email, phone });
    } else {
      CustomerData.create({ id, email, phone });
    }
  }
}

module.exports = { synchronizeCustomers };
