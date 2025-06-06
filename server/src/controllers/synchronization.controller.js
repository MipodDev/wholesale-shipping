const {
  synchronizeAllServices,
} = require("../services/carrierService.service");
const { synchronizeCustomers } = require("../services/customer.service");
const { synchronizeLists } = require("../services/list.service");
const { synchronizeProducts } = require("../services/product.service");
const { synchronizeAllRules } = require("../services/rule.service");
const { synchronizeStates } = require("../services/state.service");

async function synchronizeApplication(req_id, site) {
  let response = {
    req_id,
    site,
    reports: [],
    errors: [],
  };

  try {
    const syncCustomers = await synchronizeCustomers(req_id, site);
    response.reports.push({
      process: "Customer Sync",
      data: syncCustomers,
    });
  } catch (error) {
    response.reports.push({
      process: "Customer Sync",
      data: "Failed",
    });

    response.errors.push(error);
    return response;
  }

  try {
    const syncProducts = await synchronizeProducts(req_id, site);
    response.reports.push({
      process: "Product Sync",
      data: syncProducts,
    });
  } catch (error) {
    response.reports.push({
      process: "Product Sync",
      data: "Failed",
    });

    response.errors.push(error);
    return response;
  }

  //   Zip Code Synchronization

  try {
    const syncLists = await synchronizeLists(req_id);
    response.reports.push({
      process: "List Sync",
      data: syncLists,
    });
  } catch (error) {
    response.reports.push({
      process: "List Sync",
      data: "Failed",
    });

    response.errors.push(error);
    return response;
  }
  try {
    const syncRules = await synchronizeAllRules(req_id);
    response.reports.push({
      process: "Rule Sync",
      data: syncRules,
    });
  } catch (error) {
    response.errors.push(error);
    response.reports.push({
      process: "Rule Sync",
      data: "Failed",
    });
    return response;
  } //   Carrier Service Synchronization
  try {
    const syncStates = await synchronizeStates(req_id);
    response.reports.push({
      process: "State Sync",
      data: syncStates,
    });
  } catch (error) {
    response.errors.push(error);
    response.reports.push({
      process: "State Sync",
      data: "Failed",
    });
    return response;
  }
  return response;
}
module.exports = {
  synchronizeApplication,
};
