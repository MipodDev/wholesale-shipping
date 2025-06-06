const RequestLogs = require("../models/requestLoq.model");
const CustomerData = require("../models/customer.model");
const StateData = require("../models/state.model");
const ServiceData = require("../models/service.model");
const RuleData = require("../models/rule.model");

async function getRates(req_id, site, rate_request) {
  let rates = [];
  let rules = [];

  console.log(`\n[${req_id}] Received Rate Request from:`.magenta.bold, site);

  const customer = await getCustomerDetail(req_id, site, rate_request);
  if (customer && customer.rules && customer.rules.length > 0) {
    console.log(
      `[${req_id}] Applying Customer Rules:`.blue,
      customer.rules.length
    );
    rules = [...rules, ...customer.rules]; // ✅ add customer rules to rules
  } else {
    console.log(`[${req_id}] No Customer Rules to Apply.`.yellow);
  }

  const state = await getStateDetail(req_id, site, rate_request);
  if (!state || state.status !== "enabled") {
    console.log(`[${req_id}] State Status:`.red, state?.status || "unknown");
    rules.push({
      type: "State Status",
      range: "State",
    });
    return [];
  } else {
    console.log(`[${req_id}] State Status:`.green, state.status);
    if (state.rules.length > 0) {
      console.log(`[${req_id}] Applying State Rules:`.blue, state.rules.length);
      rules = [...rules, ...state.rules]; // ✅ append state rules to existing rules
    } else {
      console.log(`[${req_id}] No State Rules to Apply.`.yellow);
    }
  }

  const cart_detail = await getCartDetails(req_id, site, rate_request);

  const approval = await getApproval(
    req_id,
    site,
    rules,
    rate_request,
    cart_detail
  );

  const services = await getServices(
    req_id,
    site,
    rate_request,
    cart_detail,
    approval
  );
  console.log(
    `[${req_id}] Available Services for Zone:`.green,
    services.length
  );

  rates = await composeRates(req_id, site, rate_request, services);

  return rates;
}

async function getApproval(req_id, site, rules, state, cart_detail) {
  let approval = {
    allow: true,
    exempt: false,
    reason: null,
  };
  console.log(`[${req_id}] Trying approval...`.blue.bold);
  console.log(`[${req_id}] Rules to process:`.blue, rules.length);
  for (let i = 0; i < rules.length; i++) {
    if(!approval.allow){
      continue;
    }
    let targeted_area = false;
    const rule = await RuleData.findOne({ id: rules[i].id });

    const { name, range, type, lists, states, cities, zipCodes, skus } = rule;
    console.log(`[${req_id}] Validating:`.blue, name);
    switch (range) {
      case "Customer":
        console.log(`[${req_id}] Applying customer rule...`.yellow);
        targeted_area = true;
        break;
      case "State":
        console.log(`[${req_id}] Applying state rule...`.yellow);

        targeted_area = true;
        break;
      case "City":
        if (state.city) {
          console.log(`[${req_id}] Applying city rule...`.yellow);

          console.log(state.city);
        }
        break;
      case "Zip Code":
        if (state.zipCode) {
          console.log(`[${req_id}] Applying zip code rule...`.yellow);

          console.log(state.zipCode);
        }

        break;
    }
    if (!targeted_area) {
      console.log(`[${req_id}] Not Applying rule - Not within Range`.red);
      continue;
    } else {
      console.log(`[${req_id}] Applying ${type}:`.green, name);
    }
    // Check items

    const { unique_items } = cart_detail;
    switch (type) {
      case "Ban":
        let banned = false;
        for (let j = 0; j < unique_items.length; j++) {
          if (skus && skus.includes(unique_items[j])) {
            console.log(
              `[${req_id}] (Ban) Prevent Shipping Rates:`.red.bold,
              unique_items[j]
            );
            banned = true;
            approval.reason = `Banned Item: ${name} (${unique_items[j]})`;
            break;
          }
        }
        if (banned) {
          approval.allow = false;
        }

        break;
      case "Exemption":
        let exempt = true;

        for (let j = 0; j < unique_items.length; j++) {
          if (skus && !skus.includes(unique_items[j])) {
            console.log(
              `[${req_id}] Item not Exempt from Shipping Rates:`.red.bold,
              unique_items[j]
            );
            exempt = false;
            break;
          }
          if (exempt) {
            console.log(`[${req_id}] Provide Exempt Shipping Rates`.green.bold);
            approval.exempt = true;
          }
        }

        break;
      case "Registry":
        let registered = true;
        for (let j = 0; j < unique_items.length; j++) {
          if (skus && !skus.includes(unique_items[j])) {
            console.log(
              `[${req_id}] (Registry) Prevent Shipping Rates:`.red.bold,
              unique_items[j]
            );
            approval.reason = `Non-Registry Item: ${name} (${unique_items[j]})`;

            registered = false;
            break;
          }
        }
        if (registered) {
          console.log(
            `[${req_id}] (Registry) Provide Shipping Rates`.green.bold
          );
        } else {
          approval.allow = false;
          console.log(`[${req_id}] (Registry) Prevent Shipping Rates`.red.bold);
        }

        break;
    }
  }

  return approval;
}

async function getCustomerDetail(req_id, site, rate_request) {
  let customer = {
    id: null,
    email: null,
    phone: null,
    rules: null,
    site: null,
  };
  const destination = rate_request.destination;
  const normalizedPhone = destination.phone?.replace(/\D/g, ""); // Strip all non-numeric chars, e.g., "(480) 252-4808" -> "4802524808"
  console.log(
    `[${req_id}] Searching for Customer Record:`.blue,
    normalizedPhone
  );

  try {
    let data = await CustomerData.findOne({
      site,
      phone: { $regex: `${normalizedPhone}$` }, // Ends with normalized phone
    });
    customer.id = data.id;
    customer.email = data.email;
    customer.phone = data.phone;
    customer.rules = data.rules;
    customer.site = data.site;

    console.log(
      `[${req_id}] Retreived Customer Record:`.green.bold,
      customer.email
    );
  } catch (error) {
    console.log(`${req_id}] Error retreiving customer:`.red, error);
    customer = null;
  }
  return customer;
}

async function getServices(req_id, site, rate_request, cart_detail, approval) {
  const { allow, exempt, reason } = approval;
  if (!allow) {
    return [];
  }

  const { destination, items } = rate_request;
  const state_code = destination.province;
  const zip_code = destination.postal_code?.substring(0, 5);
  let available_services = [];
  console.log(`[${req_id}] Retrieving Services in:`.blue, state_code);

  const services = await ServiceData.find({
    provinces: state_code,
  });
  if (services.length === 0) {
    throw new Error("No services assigned to this destination");
  } else {
    for (let i = 0; i < services.length; i++) {
      const {
        id,
        name,
        description,
        minimum_order_value,
        price,
        free_shipping_threshold,
        per_box_value_set,
        service_name,
        service_code,
        for_zips,
      } = services[i];
      console.log(
        `[${req_id}] (${i + 1}) Processing:`.yellow,
        `${name} (${description})`
      );

      let box_multiplier = 1;
      if ((per_box_value_set !== null) & (per_box_value_set !== "")) {
        box_multiplier = Math.ceil(cart_detail.order_total / per_box_value_set);
        console.log(`[${req_id}] Box Multiplier set:`.yellow, box_multiplier);
      } else {
        console.log(`[${req_id}] Box Multiplier not needed...`.yellow);
      }

      if (minimum_order_value > cart_detail.order_total) {
        console.log(
          `[${req_id}] Order Total does not meet MOV:`.red,
          `Cart: $${(cart_detail.order_total / 100).toFixed(2)} | MOV: $${(
            minimum_order_value / 100
          ).toFixed(2)}`
        );

        continue;
      }
      let service_price = box_multiplier * price;
      console.log(
        `[${req_id}] Set Price:`.yellow,
        `$${(service_price / 100).toFixed(2)}`
      );

      if (
        free_shipping_threshold > 0 &&
        cart_detail.order_total >= free_shipping_threshold
      ) {
        console.log(
          `[${req_id}] Free Shipping Applied:`.green,
          `$${(cart_detail.order_total / 100).toFixed(2)} >= $${(
            free_shipping_threshold / 100
          ).toFixed(2)}`
        );

        service_price = 0;
      } else {
        console.log(`[${req_id}] Not elligible for free shipping...`.yellow);
      }
      if (exempt) {
        service_price = 0;
      }
      let carrier_service = {
        service_name,
        service_code,
        total_price: `${service_price}`,
        currency: "USD",
      };

      if (for_zips.length > 0) {
        if (for_zips.includes(zip_code)) {
          console.log(
            `[${req_id}] Adding Service:`.green,
            carrier_service.service_name
          );

          available_services.push(carrier_service);
        } else {
          console.log(
            `[${req_id}] Destination out of Zip Code Coverage:`.red,
            `${zip_code}`
          );
          continue;
        }
      } else {
        console.log(
          `[${req_id}] Adding Service:`.green,
          carrier_service.service_name
        );

        available_services.push(carrier_service);
      }
    }
  }

  return available_services;
}

async function getCartDetails(req_id, site, rate_request) {
  const { items } = rate_request;
  let item_set = new Set();

  let order_total = 0;
  console.log(`[${req_id}] Summarizing ${items.length} items...`.blue);

  for (let i = 0; i < items.length; i++) {
    const { name, sku, quantity, price } = items[i];
    let line_total = quantity * price;
    // console.log(`[${req_id}] (${sku}) ${name}`.blue);
    // const cash_line_total = (line_total / 100).toFixed(2);
    // console.log(`[${req_id}] ${quantity} * ${price} = $${cash_line_total}`.blue);
    order_total = +line_total;
    item_set.add(sku);
  }
  const unique_items = Array.from(item_set);
  const cash_total = (order_total / 100).toFixed(2);

  console.log(`[${req_id}] Order Total:`.green, `$${cash_total}`);
  console.log(`[${req_id}] Unique Items Ordered:`.green, unique_items.length);

  return { unique_items, order_total };
}

async function getStateDetail(req_id, site, rate_request) {
  const { destination } = rate_request;
  console.log(`[${req_id}] Searching for State detail...`.blue);
  let detail = {
    name: null,
    code: null,
    status: null,
    zipCode: null,
    city: null,
    rules: [],
  };
  try {
    const state = await StateData.findOne({
      code: destination.province,
    });
    detail.name = state.name;
    detail.code = state.code;
    detail.status = state.status;
    detail.rules = state.rules;
    detail.city = destination.city;
    detail.zipCode = destination.postal_code;
    console.log(`[${req_id}] Retreived State:`.green, state.name);
  } catch (error) {
    console.log(`Error finding destination detail:`, error);
    detail = null;
  }
  return detail;
}

async function composeRates(req_id, site, rate_request, services) {
  console.log(`[${req_id}] Rates:`.magenta.bold, services);
  return services;
}

module.exports = { getRates };
