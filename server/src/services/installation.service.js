const {
  listCarrierServices,
  getCarrierService,
  createCarrierService,
  updateCarrierService,
} = require("../graphql/carrierServices");
const SiteData = require("../models/site.model");
const colors = require("colors");
const { saveInstallation } = require("../controllers/installation.controller");

async function getAllInstalledServices(site) {
  let response = [];

  const data = await listCarrierServices(site);
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

async function checkInstalledService(site) {
  let carrier_service = null;

  const installation = await SiteData.findOne({ code: site });

  const data = await getCarrierService(site, installation.gid);
  if (data) {
    carrier_service = data.carrierService;
    console.log(`Carrier Service Found:`.green, carrier_service.id);
  } else {
    throw new Error("No Carrier Service Found");
  }

  try {
    const saved = await saveInstallation(site, carrier_service); // This updates the `updatedAt` timestamp
    console.log(`Installation updated successfully.`.green.bold);
    return saved;
  } catch (err) {
    console.error(`Failed to update installation:`.red.bold, err);
    return null;
  }
}

async function updateInstalledService(site, input) {
  let carrier_service = input;

  const installation = await SiteData.findOne({ code: site });

  if (!installation) {
    console.error(`Site not found for code: ${site}`.red.bold);
    return null;
  }

  console.log(`Updating Installation for:`.yellow, installation.name);
  try {
    let response = await updateCarrierService(site, carrier_service);
    console.log(`Updated Shopify Carrier Service:`.green, response);
    carrier_service = response.carrierServiceUpdate.carrierService;
  } catch (error) {
    console.error(error);
    return null;
  }
  try {
    const saved = await saveInstallation(site, carrier_service); // This updates the `updatedAt` timestamp
    console.log(`Installation updated successfully.`.green.bold);
    return saved;
  } catch (err) {
    console.error(`Failed to update installation:`.red.bold, err);
    return null;
  }

}

async function installService(site, input) {
  console.log(site, input);
}

module.exports = {
  getAllInstalledServices,
  checkInstalledService,
  updateInstalledService,
  installService,
};
