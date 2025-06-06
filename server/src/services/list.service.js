const ListData = require("../models/list.model");
const RuleData = require("../models/rule.model");
const productData = require("../models/product.model");

const { v4: uuidv4 } = require("uuid");
const colors = require("colors");

async function synchronizeLists(req_id) {
  let results = {
    req_id,
    lists: 0,
    updated: 0,
    errors: [],
  };

  const lists = await ListData.find().select("id name");
  console.log(`[${req_id}] Found Lists:`.green.bold, lists.length);
  results.lists = lists.length;
  for (let i = 0; i < lists.length; i++) {
    try {
      const sync = await synchronizeOneList(req_id, lists[i].id);
      if (sync) {
        results.updated++;
      }
    } catch (error) {
      results.push(error);
    }
  }
  return results;
}

async function synchronizeOneList(req_id, list_id) {
  try {
    const existing = await ListData.findOne({ id: list_id });
    console.log(`\n[${req_id}] Synchronizing List:`.blue.bold, existing.name);

    let product_set = new Set();
    let sku_set = new Set();
    // Query Included Products and Add to Product Set/Skus
    console.log(`[${req_id}] Inclusion Objects:`.blue, existing.include.length);
    if (existing.include.length > 0) {
      for (let i = 0; i < existing.include.length; i++) {
        const query = existing.include[i];
        const products = await queryProducts(req_id, query);
        for (let j = 0; j < products.length; j++) {
          const { product_id, title, status, variants, unique_skus } =
            products[j];
          if (product_set.has({id: product_id})) {
            console.log(
              `[${req_id}] - Product already added to list:`.yellow,
              product_id
            );
          } else {
            // console.log(
            //   `[${req_id}] - Product added to list:`.green,
            //   product_id
            // );
            
            product_set.add({
              id: product_id,
              title,
              status,
              variants,
            });
            for (let sku of unique_skus) {
              if (!sku_set.has(sku)) {
                sku_set.add(sku);
              }
            }
          }
        }
      }
    }

    // Query Excluded Products and Remove from Product Set/Skus
    console.log(`[${req_id}] Exclusion Objects:`.blue, existing.exclude.length);

    if (existing.exclude.length > 0) {
      for (let i = 0; i < existing.exclude.length; i++) {
        const query = existing.exclude[i];
        const products = await queryProducts(req_id, query);
        for (let j = 0; j < products.length; j++) {
          const { product_id, unique_skus } = products[j];
          if (product_set.has({id: product_id})) {
            console.log(
              `[${req_id}] - Excluding Product from List:`.red,
              product_id
            );
            product_set.delete({id: product_id});
            for (let sku of unique_skus) {
              if (sku_set.has(sku)) {
                sku_set.delete(sku);
              }
            }
          } else {
            console.log(
              `[${req_id}] - Product isn't included in List:`.yellow,
              product_id
            );
          }
        }
      }
    }
    const skus = Array.from(sku_set);
    const products = Array.from(product_set);

    console.log(`[${req_id}] Products Included:`.green, products.length);
        console.log(`[${req_id}] Skus Included:`.green, skus.length);

    existing.skus = skus;
    existing.products = products;
    const saved = await existing.save();
    console.log(`[${req_id}] Synchronized List:`.green.bold, saved.name);

  } catch (error) {
    console.log(error);
  }
  return false;
}

async function queryProducts(req_id, query) {
  const { key, value } = query;
  console.log(
    `[${req_id}] Executing Product Query | Type: ${key} | Value: ${value}`.yellow
  );

  let products = [];
  switch (key) {
    case "category":
      products = await productData.find({ category: value });
      break;
    case "tag":
      products = await productData.find({ tags: value });
      break;
    case "flavor":
      console.log(`Work in Progress...`);
      break;
  }
  console.log(`[${req_id}] Products retreived:`.green.bold, products.length);

  return products;
}

module.exports = {
  synchronizeLists,
  synchronizeOneList,
};
