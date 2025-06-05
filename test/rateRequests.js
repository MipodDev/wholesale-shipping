const {getRates} = require("../server/")

const example_request = {
  rate: {
    origin: {
      country: "US",
      postal_code: "85008",
      province: "AZ",
      city: "Phoenix",
      name: null,
      address1: "4908 E Mcdowell Rd",
      address2: "Suite 100",
      address3: null,
      latitude: 33.4667751,
      longitude: -111.9758635,
      phone: null,
      fax: null,
      email: null,
      address_type: null,
      company_name: "mipodwholesale-avalara",
    },
    destination: {
      country: "US",
      postal_code: "85008",
      province: "AZ",
      city: "Phoenix",
      name: "Dylan Walters",
      address1: "4908 East McDowell Road",
      address2: null,
      address3: null,
      latitude: 33.466806,
      longitude: -111.9758276,
      phone: "18007689982",
      fax: null,
      email: null,
      address_type: null,
      company_name: null,
    },
    items: [
      {
        name: "Aloe GrapSe Orion Bar 7500 - Wholesale A / 50mg / 10 Pack",
        sku: "53364-10",
        quantity: 9,
        grams: 850,
        price: 8000,
        vendor: "Lost Vape",
        requires_shipping: true,
        taxable: true,
        fulfillment_service: "manual",
        properties: {},
        product_id: 8052175536296,
        variant_id: 45793663484072,
      },
    ],
    currency: "USD",
    locale: "en-US",
  },
};

const test_cases = [
  {
    rate: {
      origin: {
        country: "US",
        postal_code: "85008",
        province: "AZ",
        city: "Phoenix",
        name: null,
        address1: "4908 E Mcdowell Rd",
        address2: "Suite 100",
        address3: null,
        latitude: 33.4667751,
        longitude: -111.9758635,
        phone: null,
        fax: null,
        email: null,
        address_type: null,
        company_name: "mipodwholesale-avalara",
      },
      destination: {
        country: "US",
        postal_code: "85008",
        province: "AZ",
        city: "Phoenix",
        name: "Dylan Walters",
        address1: "4908 East McDowell Road",
        address2: null,
        address3: null,
        latitude: 33.466806,
        longitude: -111.9758276,
        phone: "18007689982",
        fax: null,
        email: null,
        address_type: null,
        company_name: null,
      },
      items: [
        {
          name: "Aloe Grape Orion Bar 7500 - Wholesale A / 50mg / 10 Pack",
          sku: "53364-10",
          quantity: 9,
          grams: 850,
          price: 8000,
          vendor: "Lost Vape",
          requires_shipping: true,
          taxable: true,
          fulfillment_service: "manual",
          properties: {},
          product_id: 8052175536296,
          variant_id: 45793663484072,
        },
      ],
      currency: "USD",
      locale: "en-US",
    },
  },
  {
    rate: {
      origin: {
        country: "US",
        postal_code: "85008",
        province: "AZ",
        city: "Phoenix",
        name: null,
        address1: "4908 E Mcdowell Rd",
        address2: "Suite 100",
        address3: null,
        latitude: 33.4667751,
        longitude: -111.9758635,
        phone: null,
        fax: null,
        email: null,
        address_type: null,
        company_name: "mipodwholesale-avalara",
      },
      destination: {
        country: "US",
        postal_code: "99654",
        province: "AK",
        city: "Wasilla",
        name: "Dylan Walters",
        address1: "2184 W Lake Lucille Dr",
        address2: null,
        address3: null,
        latitude: null,
        longitude: null,
        phone: "18007689982",
        fax: null,
        email: null,
        address_type: null,
        company_name: null,
      },
      items: [
        {
          name: "Aloe Grape Orion Bar 7500 - Wholesale A / 50mg / 10 Pack",
          sku: "53364-10",
          quantity: 9,
          grams: 850,
          price: 8000,
          vendor: "Lost Vape",
          requires_shipping: true,
          taxable: true,
          fulfillment_service: "manual",
          properties: {},
          product_id: 8052175536296,
          variant_id: 45793663484072,
        },
      ],
      currency: "USD",
      locale: "en-US",
    },
  },
];

async function runTest(test_type) {
  switch (test_type) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
  }
}

runTest();
