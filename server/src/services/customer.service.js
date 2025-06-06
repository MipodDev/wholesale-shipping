const CustomerData = require("../models/customer.model");
const RuleData = require("../models/rule.model");
const { BCv2 } = require("businesscentral");

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
      console.log(
        `[${req_id}] Retreiving next ${first} customers (${processed})`
      );

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
  for (let i = 0; i < update_customers.length; i++) {
    const { id, email, phone } = update_customers[i];
    const existing = await CustomerData.findOne({ id });
    if (existing) {
      existing.email = email;
      existing.phone = phone;
      existing.site = site;
      existing.customerNumber = await getCustomerNumber(req_id, email);
      const saved = await existing.save();
      console.log(
        `[${req_id}] (${i + 1}/${update_customers.length}) Updated:`,
        saved.email
      );
    } else {
      let customerNumber = await getCustomerNumber(req_id, email);
      CustomerData.create({ id, email, phone, site, customerNumber });
      console.log(
        `[${req_id}] (${i + 1}/${update_customers.length}) Created:`,
        email
      );
    }
  }
  return processed;
}

async function applyRuleToCustomer(site, customer_gid, rule_id) {
  console.log("Applying rule to customer:".blue.bold, customer_gid);

  const customer = await CustomerData.findOne({ site, id: customer_gid });
  if (!customer) {
    console.error("Customer not found.");
    return;
  }
  console.log(`Found customer:`.green, customer.email);

  // Check if rule already exists in customer's rules
  const alreadyApplied = customer.rules.some((r) => r.id === rule_id);
  if (alreadyApplied) {
    console.log("Rule already applied to customer.".yellow);
    return;
  }

  const rule = await RuleData.findOne({ id: rule_id });
  if (!rule) {
    console.error("Rule not found.");
    return;
  }
  console.log(`Retrieved Rule:`.green, rule.name);

  customer.rules.push({
    id: rule.id,
    name: rule.name,
    range: rule.range,
    type: rule.type,
    lists: rule.lists,
  });

  const saved = await customer.save();
  console.log("Rule applied and customer updated successfully.".green.bold);
}

async function getCustomerNumber(req_id, customer_email) {
  console.log(
    `[${req_id}] Retreiving customer number for:`.yellow,
    customer_email
  );

  const customers = await BCv2.getCustomers({
    $filter: `email eq '${customer_email}'`,
  });
  if (customers.length > 0) {
    console.log(customers);
    let customerNumber = customers[0].number;
    return customerNumber;
  } else {
    console.log(`No Customers Found`);
    return null;
  }
}

module.exports = { synchronizeCustomers, applyRuleToCustomer };
