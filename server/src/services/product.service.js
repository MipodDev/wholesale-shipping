const {
  retreiveProducts,
  retreiveOneProduct,
  retreiveProductVariants,
} = require("../graphql/products");
const productData = require("../models/product.model");

async function synchronizeProducts(req_id, site) {
  console.log(
    `[${req_id}] Initializing Product Synchronization for:`.blue.bold,
    site
  );

  let response = {
    req_id,
    site,
    products: 0,
    synchronized: 0,
    errors: [],
  };
  // Retreive Product Data from Targeted Site
  let products = null;
  try {
    products = await getAllProductData(req_id, site);
    response.products = products.count;
    console.log(
      `[${req_id}] Products found for ${site}:`.green.bold,
      products.count
    );
  } catch (error) {
    console.error(
      `[${req_id}] Error retreiving Products for ${site}:`.red.bold,
      error
    );
    response.errors.push(error);
    return response;
  }
  if (!products) {
    response.errors.push("No Products found");
    return response;
  }
  // Save Product Data to Database
  for (let i = 0; i < products.data.length; i++) {
    console.log(
      `[${req_id}] (${i + 1}/${products.data.length}) Synchronizing...`.yellow
        .bold
    );
    try {
      const saved = await synchronizeOneProduct(
        req_id,
        site,
        products.data[i].id
      );
      if (saved) {
        response.synchronized++;
      }
    } catch (error) {
      console.error(
        `[${req_id}] Error saving Product (${products[i].id}) for ${site}:`.red
          .bold,
        error
      );
      response.errors.push(error);
      return response;
    }
  }

  // Trigger List Synchronization

  return response;
}

async function synchronizeOneProduct(req_id, site, product_id) {
  let saved = false;
  const data = await retreiveOneProduct(req_id, site, product_id);
  const { id, title, status, variantsCount, tags, metafield } = data.product;
  let record = {
    product_id: id,
    title,
    status,
    category: metafield ? metafield.value : null,
    variantsCount: variantsCount.count,
    unique_skus: [],
    tags,
    site,
    variants: [],
  };
  const variantData = await retreiveProductVariants(
    req_id,
    site,
    product_id,
    record.variantsCount
  );
  const variants = variantData.product.variants.nodes;
  let sku_set = new Set();
  for (let i = 0; i < variants.length; i++) {
    const { sku } = variants[i];
    sku_set.add(sku);
  }
  record.variants = variants;
  record.unique_skus = Array.from(sku_set);
  try {
    saved = await saveProductData(req_id, site, record);
  } catch (error) {
    console.error(error);
  }

  return saved;
}

// filter.product_category
// filter.flavor
async function getAllProductData(req_id, site) {
  console.log(`[${req_id}] Retreiving Product Data for:`.blue.bold, site);
  let response = {
    count: 0,
    data: [],
    errors: [],
  };
  const first = 100;
  let lastCursor = null;
  let filter = `first: ${first}`;

  while (true) {
    if (lastCursor) {
      filter = `first: ${first}, after: "${lastCursor}"`;
    }
    console.log(
      `[${req_id}] Retreiving ${first} products (${response.count})`.yellow.bold
    );

    const data = await retreiveProducts(req_id, site, filter);
    const pageInfo = data.products.pageInfo;
    const products = data.products.nodes;
    lastCursor = pageInfo.endCursor;
    for (let i = 0; i < products.length; i++) {
      if (products[i].status === "ARCHIVED") {
        continue;
      }
      response.data.push(products[i]);
    }

    response.count += products.length;
    if (products.length < first) {
      break;
    }
  }

  return response;
}

async function saveProductData(req_id, site, product) {
  console.log(
    `[${req_id}] Checking updates for Product:`.blue.bold,
    product.product_id
  );
  let saved = false;
  if (product.status === "ARCHIVED") {
    console.log(`[${req_id}] Product Inactive - Skipping Update:`.yellow.bold);
    return;
  }
  const existing = await productData.findOne({
    product_id: product.product_id,
  });
  if (!existing) {
    console.log(`[${req_id}] Existing Product not found`.yellow);
    try {
      const newRecord = await productData.create(product);
      console.log(
        `[${req_id}] Product Created:`.green.bold,
        newRecord.product_id
      );
      saved = true;
    } catch (error) {
      console.log(`[${req_id}] Error creating Product:`.red.bold, error);
    }
  } else {
    let updates = 0;
    // Check for updates
    if (existing.title !== product.title) {
      console.log(`[${req_id}] Update Detected:`.yellow, "title");
      existing.title = product.title;
      updates++;
    }
    if (existing.status !== product.status) {
      console.log(`[${req_id}] Update Detected:`.yellow, "status");
      existing.status = product.status;
      updates++;
    }
    if (existing.category !== product.category) {
      console.log(`[${req_id}] Update Detected:`.yellow, "category");
      existing.category = product.category;
      updates++;
    }
    if (existing.variantsCount !== product.variantsCount) {
      console.log(`[${req_id}] Update Detected:`.yellow, "variantsCount");
      existing.variantsCount = product.variantsCount;
      updates++;
    }
    if (existing.site !== product.site) {
      console.log(`[${req_id}] Update Detected:`.yellow, "site");
      existing.site = product.site;
      updates++;
    }
    const areArraysEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((item, idx) => item === arr2[idx]);
    };

    if (!areArraysEqual(existing.unique_skus, product.unique_skus)) {
      console.log(`[${req_id}] Update Detected:`.yellow, "unique_skus");
      existing.unique_skus = [...product.unique_skus];
      updates++;
    }

    if (!areArraysEqual(existing.tags, product.tags)) {
      console.log(`[${req_id}] Update Detected:`.yellow, "tags");
      existing.tags = [...product.tags];
      updates++;
    }

    const compareVariantsByFields = (a, b, fields = ["id", "sku", "title"]) => {
      if (a.length !== b.length) return false;

      for (let i = 0; i < a.length; i++) {
        for (const field of fields) {
          if (a[i][field] !== b[i][field]) {
            return false;
          }
        }
      }

      return true;
    };

    if (!compareVariantsByFields(existing.variants, product.variants)) {
      console.log(`[${req_id}] Update Detected:`.yellow, "variants");
      existing.variants = product.variants.map((variant, i) => ({
        ...variant,
        _id: existing.variants[i]?._id || undefined, // Preserve _id if it exists
      }));
      updates++;
    }

    // Save record if Updated
    if (updates > 0) {
      console.log(`[${req_id}] Updates Found:`.blue, updates);

      try {
        const savedRecord = await existing.save();
        console.log(
          `[${req_id}] Product Updated:`.green.bold,
          savedRecord.product_id
        );
        saved = true;
      } catch (error) {
        console.log(`[${req_id}] Error saving Product:`.red.bold, error);
      }
    } else {
      console.log(`[${req_id}] No updates Found.`.yellow);
    }
  }

  return saved;
}

module.exports = {
  synchronizeProducts,
  synchronizeOneProduct,
};
