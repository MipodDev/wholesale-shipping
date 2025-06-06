const { retreiveProducts } = require("../graphql/products");

async function synchronizeProducts(req_id, site) {
  let results = {
    status: "Initialized",
    updated: 0,
    req_id,
    site,
    errors: [],
  };
  let products = null;
  try {
    products = await retreiveProducts(req_id, site);
  } catch (error) {
    results.status = "Failed";
    results.errors.push(error);
    return results;
  }
  return results;
}

module.exports = {
  synchronizeProducts,
};
