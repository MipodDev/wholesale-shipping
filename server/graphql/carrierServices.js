const { shopifyQl } = require("../api/Shopify.QL");

async function listCarrierServices(site) {
  const query = `query CarrierServiceList {
  carrierServices(first: 10, query: "active:true") {
    edges {
      node {
        id
        name
        callbackUrl
        active
        supportsServiceDiscovery
      }
    }
  }
}`;
  const input = null;
  const response = await shopifyQl(site, query, input);
  return response.data;
}

async function getCarrierService(site, id) {
  const query = `query CarrierServiceShow($id: ID!) {
  carrierService(id: $id) {
    id
    name
    callbackUrl
    active
    supportsServiceDiscovery
  }
}`;
  const input = {
    id: id,
  };
  const response = await shopifyQl(site, query, input);
  return response.data;
}

async function createCarrierService(site, carrier_service) {
  const { name, callbackUrl, supportsServiceDiscovery, active } =
    carrier_service;
  if (!name || !callbackUrl || !supportsServiceDiscovery || !active) {
    throw new Error(
      "Missing Input value in Carrier Service Creation:",
      carrier_service
    );
  }
  const query = `mutation CarrierServiceCreate($input: DeliveryCarrierServiceCreateInput!) {
  carrierServiceCreate(input: $input) {
    carrierService {
      id
      name
      callbackUrl
      active
      supportsServiceDiscovery
    }
    userErrors {
      field
      message
    }
  }
}`;
  const input = {
    input: {
      name,
      callbackUrl,
      supportsServiceDiscovery,
      active,
    },
  };
  const response = await shopifyQl(site, query, input);
  return response.data;
}

async function updateCarrierService(site, carrier_service) {
  const { id, name, callbackUrl, supportsServiceDiscovery, active } =
    carrier_service;
  if (!id || !name || !callbackUrl || !supportsServiceDiscovery || !active) {
    throw new Error(
      "Missing Input value in Carrier Service Creation:",
      carrier_service
    );
  }

  const query = `mutation CarrierServiceUpdate($input: DeliveryCarrierServiceUpdateInput!) {
  carrierServiceUpdate(input: $input) {
    carrierService {
      id
      name
      callbackUrl
      active
      supportsServiceDiscovery
    }
    userErrors {
      field
      message
    }
  }
}`;
  const input = {
    input: {
      id,
      name,
      callbackUrl,
      supportsServiceDiscovery,
      active,
    },
  };
  const response = await shopifyQl(site, query, input);
  return response.data;
}

module.exports = {
  listCarrierServices,
  getCarrierService,
  createCarrierService,
  updateCarrierService,
};
