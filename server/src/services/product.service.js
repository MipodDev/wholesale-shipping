const {
  retreiveProducts,
  retreiveOneProduct,
  retreiveProductVariants,
} = require("../graphql/products");
const productData = require("../models/product.model");

/**
 * Main synchronization entry point
 */
async function synchronizeProducts(req_id, site) {
  console.log(`[${req_id}] Initializing Product Sync for:`.blue.bold, site);

  let response = {
    req_id,
    site,
    products: 0,
    synchronized: 0,
    errors: [],
  };

  let products;
  try {
    products = await getAllProductData(req_id, site);
    response.products = products.count;
    console.log(`[${req_id}] Products found:`.green.bold, products.count);
  } catch (err) {
    console.error(`[${req_id}] Error fetching products:`.red.bold, err);
    response.errors.push(err);
    return response;
  }

  const concurrency = 5;
  let index = 0;

  while (index < products.data.length) {
    const batch = products.data.slice(index, index + concurrency);
    await Promise.all(
      batch.map(async (product, i) => {
        const idx = index + i + 1;
        try {
          console.log(`[${req_id}] (${idx}/${products.data.length}) Syncing:`.yellow.bold, product.id);
          const saved = await synchronizeOneProduct(req_id, site, product.id);
          if (saved) response.synchronized++;
        } catch (err) {
          console.error(`[${req_id}] Error saving product ${product.id}:`.red.bold, err);
          response.errors.push({ product_id: product.id, error: err.message });
        }
      })
    );
    index += concurrency;
  }

  return response;
}

/**
 * Sync a single product by ID
 */
async function synchronizeOneProduct(req_id, site, product_id) {
  const data = await retreiveOneProduct(req_id, site, product_id);
  const { id, title, status, variantsCount, tags, metafield } = data.product;

  const record = {
    product_id: id,
    title,
    status,
    category: metafield?.value || null,
    variantsCount: variantsCount.count,
    unique_skus: [],
    tags,
    site,
    variants: [],
  };

  const variantData = await retreiveProductVariants(req_id, site, product_id, record.variantsCount);
  const variants = variantData.product.variants.nodes;
  record.variants = variants;
  record.unique_skus = [...new Set(variants.map(v => v.sku))];

  return await saveProductData(req_id, site, record);
}

/**
 * Retrieve paginated product data
 */
async function getAllProductData(req_id, site) {
  console.log(`[${req_id}] Fetching Products for:`.blue.bold, site);
  const first = 100;
  let lastCursor = null;
  let total = 0;
  const data = [];

  while (true) {
    const filter = lastCursor ? `first: ${first}, after: "${lastCursor}"` : `first: ${first}`;
    const res = await retreiveProducts(req_id, site, filter);
    
    const products = res.products.nodes;
    const nodes = products.filter(p => p.status !== "ARCHIVED");
    data.push(...nodes);
    total += nodes.length;
    lastCursor = res.products.pageInfo.endCursor;

    console.log(`[${req_id}] Loaded ${total} products...`.cyan);

    if (products.length < first) break;
  }

  return { count: total, data };
}

/**
 * Create or update product record in DB
 */
async function saveProductData(req_id, site, product) {
  if (product.status === "ARCHIVED") return false;

  let existing = await productData.findOne({ product_id: product.product_id });
  let saved = false;

  if (!existing) {
    const created = await productData.create(product);
    console.log(`[${req_id}] Product created:`.green.bold, created.product_id);
    return true;
  }

  let updates = 0;

  const updateIfChanged = (field, newValue) => {
    if (existing[field] !== newValue) {
      existing[field] = newValue;
      updates++;
    }
  };

  updateIfChanged("title", product.title);
  updateIfChanged("status", product.status);
  updateIfChanged("category", product.category);
  updateIfChanged("variantsCount", product.variantsCount);
  updateIfChanged("site", product.site);

  const arraysMatch = (a, b) =>
    Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);

  if (!arraysMatch(existing.unique_skus, product.unique_skus)) {
    existing.unique_skus = [...product.unique_skus];
    updates++;
  }

  if (!arraysMatch(existing.tags, product.tags)) {
    existing.tags = [...product.tags];
    updates++;
  }

  const variantsEqual = (a, b) =>
    a.length === b.length &&
    a.every((v, i) => ["id", "sku", "title"].every(key => v[key] === b[i]?.[key]));

  if (!variantsEqual(existing.variants, product.variants)) {
    existing.variants = product.variants.map((v, i) => ({
      ...v,
      _id: existing.variants[i]?._id || undefined,
    }));
    updates++;
  }

  if (updates > 0) {
    await existing.save();
    console.log(`[${req_id}] Product updated:`.green.bold, product.product_id);
    saved = true;
  }

  return saved;
}

module.exports = {
  synchronizeProducts,
  synchronizeOneProduct,
};
