const SiteData = require("../models/site.model");

async function saveInstallation(site, carrier_service) {
  const installation = await SiteData.findOne({ code: site });
  installation.gid = carrier_service.id;
  installation.app_name = carrier_service.name;
  installation.callbackUrl = carrier_service.callbackUrl;
  installation.active = carrier_service.active;
  installation.supportsServiceDiscovery =
    carrier_service.supportsServiceDiscovery;
  try {
    const saved = await installation.save(); // This updates the `updatedAt` timestamp
    return saved;
  } catch (err) {
    return null;
  }

}

module.exports = {
  saveInstallation,
};
