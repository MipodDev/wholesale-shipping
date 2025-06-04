const {
  listCarrierServices,
  getCarrierService,
  createCarrierService,
  updateCarrierService,
} = require("../graphql/carrierServices");
const SiteData = require("../models/site.model");
const colors = require("colors");
const { saveInstallation } = require("../controllers/installation.controller");

async function getAllInstalledServices(req_id, site) {
  let response = [];

  const data = await listCarrierServices(site);
  console.log(`[${req_id}] Installed Services:`.green, data.carrierServices.edges.length)
  for (let i = 0; i < data.carrierServices.edges.length; i++) {
    const { node } = data.carrierServices.edges[i];
    response.push({
      id: node.id,
      name: node.name,
      callbackUrl: node.callbackUrl,
      active: node.active,
      supportsServiceDiscovery: node.supportsServiceDiscovery,
    });
  }
  return response;
}

async function checkInstalledService(req_id, site) {
  let carrier_service = null;

  const installation = await SiteData.findOne({ code: site });

  const data = await getCarrierService(site, installation.gid);
  if (data) {
    carrier_service = data.carrierService;
    console.log(`[${req_id}] Carrier Service Found:`.green, carrier_service.id);
  } else {
    throw new Error(`[${req_id}] No Carrier Service Found`);
  }

  try {
    const saved = await saveInstallation(site, carrier_service); // This updates the `updatedAt` timestamp
    console.log(`[${req_id}] Installation updated successfully.`.green.bold);
    return saved;
  } catch (err) {
    console.error(`Failed to update installation:`.red.bold, err);
    return null;
  }
}

async function updateInstalledService(req_id, site, input) {
  let carrier_service = input;

  const installation = await SiteData.findOne({ code: site });

  if (!installation) {
    console.error(`[${req_id}] Site not found for code: ${site}`.red.bold);
    return null;
  }

  console.log(`[${req_id}] Updating Installation for:`.yellow, installation.name);
  try {
    let response = await updateCarrierService(site, carrier_service);
    console.log(`[${req_id}] Updated Shopify Carrier Service:`.green, response);
    carrier_service = response.carrierServiceUpdate.carrierService;
  } catch (error) {
    console.error(error);
    return null;
  }
  try {
    const saved = await saveInstallation(site, carrier_service); // This updates the `updatedAt` timestamp
    console.log(`[${req_id}] Installation updated successfully.`.green.bold);
    return saved;
  } catch (err) {
    console.error(`[${req_id}] Failed to update installation:`.red.bold, err);
    return null;
  }

}

async function installService(req_id, site, input) {
  console.log(site, input);
}

module.exports = {
  getAllInstalledServices,
  checkInstalledService,
  updateInstalledService,
  installService,
};
