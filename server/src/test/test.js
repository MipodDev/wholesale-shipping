const { shopifyQl } = require("../api/Shopify.QL");
const {
  retreiveCustomerData,
  deleteCustomer,
  customerCleanupQuery,
} = require("../graphql/customers");
const { v4: uuidv4 } = require("uuid");
const SiteData = require("../models/site.model");
const RuleData = require("../models/rule.model");
const StateData = require("../models/state.model");
const ListData = require("../models/list.model");
const { applyRuleToCustomer } = require("../services/customer.service");
const { syncRules } = require("../services/rule.service");
const { synchronizeServices } = require("../services/carrierService.service");
async function test() {
  const site = "SBX";
  await syncRules(uuidv4());
  return;
  const rule = await RuleData.findOne({
    id: "ad385d89-cc02-460c-b565-1e51257a0c64",
  });
  console.log(`Found Rule:`, rule.name);
  let xRule = rule;
  for (let stateCode of rule.targeted_areas) {
    const state = await StateData.findOne({ code: stateCode });
    rule.states.push({
      name: state.name,
      code: state.code,
    });
  }
  rule.lists = rule.targeted_lists;
  rule.skus = rule.targeted_skus;
  if (xRule !== rule) {
    console.log(`Changes found:`, rule.name);

    const saved = await rule.save();
    console.log(`Updated Rule:`, saved);
  } else {
    console.log("No changes found");
  }
}

async function createTestCustomerBan() {
  const lists = await ListData.find();
  console.log(lists);

  const rule_data = {
    id: uuidv4(),
    name: "Dylan's Registry",
    range: "Customer",
    type: "Registry",
    lists: {
      id: "9a61a6b7-0f0c-47d8-b010-96eb6a27ee78",
      name: "Nixodine Product List",
      category: "Nixodine",
    },
  };
  const rule = await RuleData.create(rule_data);
  console.log(`New rule created:`, rule);
}

// async function testInstallation() {
//   const site = "SBX";
//   const carrier_service = {
//     name: "test carrier service",
//     callbackUrl: "https://4p5zvprf-3000.usw3.devtunnels.ms/rates",
//     supportsServiceDiscovery: true,
//     active: true,
//   };
//   const response = await createCarrierService(site, carrier_service);
//   console.log(response);
// }

// async function test() {
//   const site = "B2B";
//   const deleteCustomers_set = new Set();
//   const approved_tags = [
//     "Wholesale A",
//     "Wholesale B (Low)",
//     "Chain Store",
//     "Distro A",
//     "Distro B (Low)",
//     "BRANDOND",
//     "SETH.RAYMER",
//     "JOSHUA.BARNARD"
//   ];
//   const date_limit = new Date("2024-01-01");
//   let processed = 0;

//   const first = 250;
//   let filter = `first: ${first}`;
//   let last_cursor = null;

//   while (true) {
//     if (last_cursor) {
//       filter = `first: ${first}, after: "${last_cursor}"`;
//     }
//     const data = await customerCleanupQuery(site, filter);
//     const customers = data.customers.edges;
//     for (let i = 0; i < customers.length; i++) {
//       processed++;
//       let points = 0;

//       const { node } = customers[i];
//       let {
//         defaultEmailAddress,
//         id,
//         defaultPhoneNumber,
//         numberOfOrders,
//         canDelete,
//         note,
//         state,
//         tags,
//         verifiedEmail,
//         createdAt
//       } = node;
//       let approvedTag = false;
//       const created_date = new Date(createdAt);
//       let protected = false;
//       if(created_date > date_limit){
//         protected = true;
//       }
//       for (let tag of tags) {
//         if (approved_tags.includes(tag)) {
//           approvedTag = true;
//         }
//       }

//       if (!canDelete || approvedTag) {
//         // console.log(`Keep Customer:`.green, id);
//       } else {
//         // console.log(`Inspect Customer:`.yellow, id);
//         // console.log(node);
//         if (!verifiedEmail) {
//           console.log(`Email Invalid`.red);
//           points++;
//         }else if(protected && verifiedEmail){
//           continue;
//         }
//         if (!defaultEmailAddress) {
//           console.log(`No Email`.red);
//           points++;
//         }
//         if (!defaultPhoneNumber) {
//           console.log(`No Phone`.red);
//           points++;
//         }
//         if (note === null) {
//           console.log(`No Note`.red);
//           points++;
//         }
//         if (tags.length === 0) {
//           console.log(`No Tags`.red);
//           points++;
//         }else if(protected && !tags.includes("newsletter") && !tags.includes("buyer_accepts_marketing")){
//           console.log(tags);
//           continue;
//         }
//         if (
//           defaultEmailAddress &&
//           defaultEmailAddress.emailAddress.includes("+")
//         ) {
//           console.log(`Invalid Email`.red);
//           points++;
//         }
//         if(points > 0){
//           console.log(`Invalidation Points:`.red.bold, points);
//           console.log(`Deleting Customer:`.red.bold, node);
//           deleteCustomers_set.add(node);
//         }
//       }
//     }

//     last_cursor = data.customers.pageInfo.endCursor;
//     if (customers.length < first) {
//       break;
//     }
//         console.log(`Customers found to delete:`.red, `${deleteCustomers_set.size}/${processed}`);

//   }
//     const delete_customers = Array.from(deleteCustomers_set);
//   const percent_deleted = (delete_customers.length / processed) * 100;

//   console.log(`Total Customers to Delete:`.red.bold, deleteCustomers_set.size, `(${percent_deleted})`);

//   for(let i = 0; i < delete_customers.length; i++){
//     const {id}=  delete_customers[i];
//     try {
//       await deleteCustomer(site, id);
//       console.log(`(${i+1}/${delete_customers.length})Deleted Customer:`.green, id);
//     } catch (error) {
//       console.log(`Error Deleting Customer ${id}:`, error);
//     }
//   }
// }

module.exports = { test };
