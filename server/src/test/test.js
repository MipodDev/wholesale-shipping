const { shopifyQl } = require("../api/Shopify.QL");
const {
  retreiveCustomerData,
  deleteCustomer,
  customerCleanupQuery,
} = require("../graphql/customers");
const { loadStates } = require("../services/state.service");
const colors = require("colors");
const SiteData = require("../models/site.model");
const {
  processRules,
} = require("../services/rule.service");

const {
  processLists,
} = require("../services/list.service");

// async function test() {
//   let customer_set = new Set();
//   let rejected_customers = new Set();

//   const site = "B2B";
//   const first = 250;

//   let filter = `first: ${first}`;
//   let last_cursor = null;
//   let processed = 0;

//   while (true) {
//     if (last_cursor) {
//       console.log(`Retreiving next ${first} customers (${processed})`);

//       filter = `first: ${first}, after: "${last_cursor}"`;
//     } else {
//       console.log(`Retreiving first ${first} customers...`);
//     }
//     const data = await retreiveCustomerData(site, filter);

//     const customers = data.customers.edges;
//     last_cursor = data.customers.pageInfo.endCursor;
//     for (let i = 0; i < customers.length; i++) {
//       const { node } = customers[i];
//       // console.log(node);
//       let customer = {
//         id: node.id,
//         email: node.defaultEmailAddress
//           ? node.defaultEmailAddress.emailAddress
//           : "",
//         phone: node.defaultPhoneNumber
//           ? node.defaultPhoneNumber.phoneNumber
//           : "",
//         numberOfOrders: node.numberOfOrders,
//       };
//       if (!node.defaultEmailAddress || !node.defaultPhoneNumber) {
//         rejected_customers.add(customer);
//       } else {
//         customer_set.add(customer);
//       }
//       processed++;
//     }
//     if (customers.length < first) {
//       break;
//     }
//   }

//   // const carrierServices = data.carrierServices.edges;
//   // for (let i = 0; i < carrierServices.length; i++) {
//   //   console.log(carrierServices[i]);
//   // }
//   const posPercent =
//     (customer_set.size / (customer_set.size + rejected_customers.size)) * 100;
//   const negPercent =
//     (rejected_customers.size / (customer_set.size + rejected_customers.size)) *
//     100;
//   console.log(`Valid Customers:`, customer_set.size, `(${posPercent}%)`);
//   console.log(
//     `Invalid Customers:`,
//     rejected_customers.size,
//     `(${negPercent}%)`
//   );
// }

// async function test(){
//   await loadStates();
// }

async function test() {
  await processLists();
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
