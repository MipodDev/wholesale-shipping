const axios = require("axios");
const colors = require("colors");
require("dotenv").config();
const { getSiteConfig } = require("../config/sites");

/**
 * Perform a ShopifyQL request.
 * @param {string} site - The site code (e.g., "B2C", "B2B", "VAP").
 * @param {string} query - The ShopifyQL query string.
 * @param {object} input - Additional input for the query (optional).
 * @returns {Promise<object>} - The response from ShopifyQL.
 */
async function shopifyQl(site, query, input = {}) {
  try {
    const { baseURL, token } = getSiteConfig(site);

    const url = `${baseURL}/graphql.json`;
    const headers = {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    };

    const response = await axios.post(
      url,
      { query, variables: input },
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error(colors.bold.red(`Error making ShopifyQL request for site: ${site}`), error.message);

    if (error.response) {
      console.error(colors.red("Response data:"), error.response.data);
      console.error(colors.red("Response status:"), error.response.status);
      console.error(colors.red("Response headers:"), error.response.headers);
    }

    throw error;
  }
}

module.exports = { shopifyQl };
