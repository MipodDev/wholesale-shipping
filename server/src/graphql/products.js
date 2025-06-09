const { shopifyQl } = require("../api/Shopify.QL");

async function retreiveProducts(req_id, site, filter = `first: 10`) {
  const query = /* GraphQL */ `query getProducts {
  products(${filter}) {
    pageInfo {
      endCursor
    }
    nodes {
      id
      title
      status

      }
  }
}`;
  const input = null;
  try {
    const response = await shopifyQl(site, query, input);
    return response.data;
  } catch (error) {
    return error;
  }
}

async function retreiveOneProduct(req_id, site, product_id) {
  const query = /* GraphQL */ `query getOneProduct {
  product(id: "${product_id}") {
    id
    title
    variantsCount {
      count
    }
    status
    tags
    metafield(key: "product_category", namespace: "filter") {
      id
      value
      key
      namespace
    }
  }
}`;
  const input = null;
  try {
    const response = await shopifyQl(site, query, input);
    return response.data;
  } catch (error) {
    return error;
  }
}

async function retreiveProductVariants(
  req_id,
  site,
  product_id,
  variantCount = 10
) {
  const query = /* GraphQL */ `query getProductVariants {
  product(id: "${product_id}") {
    id
    variants(first: ${variantCount}) {
      nodes {
        id
        sku
        title
      }
    }
  }
}`;
  const input = null;
  try {
    const response = await shopifyQl(site, query, input);
    return response.data;
  } catch (error) {
    return error;
  }
}

module.exports = {
  retreiveProducts,
  retreiveOneProduct,
  retreiveProductVariants,
};
