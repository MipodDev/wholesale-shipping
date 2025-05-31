const colors = require("colors");
require("dotenv").config();

const apiVersion = process.env.SHOPIFY_API_VERSION;

// Configuration for integrated sites
const integratedSites = [
  {
    code: "B2B",
    storeName: "mi-one-com",
    token: process.env.B2B_TOKEN,
    product_filter: `Send_to_Shopify eq true and Shopify_ID eq '' and B2B_Variant_Count ge 1`,
    item_filter: `SWC_SV_Send_to_Shopify eq true`,
    variant_filter: ``,
    price_filter: `Sales_Code eq 'D*'`,
  },
  {
    code: "B2C",
    storeName: "smoking-vapor-consumer",
    token: process.env.B2C_TOKEN,
    product_filter: `Send_to_Shopify2 eq true and Shopify_ID2 eq '' and B2C_Variant_Count ge 1`,
    item_filter: `SWC_SV_Send_to_Shopify2 eq true`,
    variant_filter: ``,
    price_filter: `Sales_Code eq 'COS'`,
  },
  {
    code: "VAP",
    storeName: "vaping-usa",
    token: process.env.VAP_TOKEN,
    product_filter: `Send_to_Shopify3 eq true and Shopify_ID3 eq '' and VAPE_Variant_Count ge 1`,
    item_filter: `SWC_SV_Send_to_Shopify3 eq true`,
    variant_filter: ``,
    price_filter: `Sales_Code eq 'VAP'`,
  },
  {
    code: "SBX",
    storeName: "mipodwholesale-avalara",
    token: process.env.SBX_TOKEN,

  }
];

/**
 * Retrieve the base URL and token for a given site.
 * @param {string} site - The site code (e.g., "B2C", "B2B", "VAP").
 * @returns {object} - An object containing the base URL and token for the site.
 */
function getSiteConfig(site) {
  const siteConfig = integratedSites.find((s) => s.code === site);

  if (!siteConfig) {
    console.error(
      colors.bold.red(`Site configuration not found for code: ${site}`)
    );
    throw new Error(`Site configuration not found for code: ${site}`);
  }

  const { storeName, token } = siteConfig;
  const baseURL = `https://${storeName}.myshopify.com/admin/api/${apiVersion}`;
  return { baseURL, token };
}

function storeFilters(site) {
  const siteConfig = integratedSites.find((s) => s.code === site);

  if (!siteConfig) {
    console.error(
      colors.bold.red(`Site configuration not found for code: ${site}`)
    );
    throw new Error(`Site configuration not found for code: ${site}`);
  }
  const { product_filter, item_filter, variant_filter, price_filter } =
    siteConfig;
  let filters = {
    product_filter,
    item_filter,
    variant_filter,
    price_filter,
  };

  return filters;
}

module.exports = { getSiteConfig, storeFilters };
