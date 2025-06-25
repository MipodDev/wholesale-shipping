const { BC } = require("businesscentral");
const colors = require("colors");
const postalCodes = require("../models/zipCode.model");
const States = require("../models/state.model");

async function loadZipCodes() {
  const states = await States.find();
  console.log(`States:`, states.length);
  for (let i = 0; i < states.length; i++) {
    const { name, code, status, rules, services, zipCodes } = states[i];
    const zip_codes = await loadZipCodesByState(code, name);

    const state = await States.findOne({code});
    state.zipCodes = zip_codes;
    await state.save();
    console.log(`State updated with zip codes:`, state.zipCodes.length);
  }
}

async function loadZipCodesByState(stateCode, stateName) {
  let data_set = new Set();

  console.log(`Retreiving Zip Codes for:`, stateCode);
  const top = 1000;
  let skip = 0;
  while (true) {
    console.log(`Zip Codes:`.yellow, `${skip} - ${skip + top}`);

    const zip_codes = await BC.findZipCodes({
      $top: top,
      $skip: skip,
      $filter: `County eq '${stateCode}'`,
    });
    skip += zip_codes.length;
    for (let i = 0; i < zip_codes.length; i++) {
      const {
        Code,
        City,
        Country_Region_Code,
        County,
        TimeZone,
        SWC_SV_County_Name,
        SWC_SV_Shipping_Agent,
        SWC_SV_Shipping_Agent_Service,
      } = zip_codes[i];

      if (SWC_SV_Shipping_Agent === "USPS") {
        continue;
      }

      const cleaned = {
        code: Code,
        city: City,
        country: Country_Region_Code,
        county: SWC_SV_County_Name,
        timezone: TimeZone,
        stateCode: County,
        state: stateName,
        agent: SWC_SV_Shipping_Agent,
        service: SWC_SV_Shipping_Agent_Service,
      };

      data_set.add(cleaned);
    }
    if (zip_codes.length < top) {
      break;
    }
  }
  const unique_set = new Set();

  const zip_codes = Array.from(data_set);
  for (let i = 0; i < zip_codes.length; i++) {
    unique_set.add({code: zip_codes[i].code, county: zip_codes[i].county});
    ;
    const existing = await postalCodes.findOne({ code: zip_codes[i].code });
    if (!existing) {
      console.log(
        `(${i + 1}/${zip_codes.length}) New Zip Code detected:`.yellow.bold,
        zip_codes[i].code
      );
    } else {
      console.log(
        `(${i + 1}/${zip_codes.length}) Existing Zip Code detected:`.blue.bold,
        zip_codes[i].code
      );

      let update_detected = false;

      if (zip_codes[i].city !== existing.city) {
        console.log(`Detected Update:`.yellow, "City");
        existing.city = zip_codes[i].city;
        update_detected = true;
      }
      if (zip_codes[i].country !== existing.country) {
        console.log(`Detected Update:`.yellow, "Country");
        existing.country = zip_codes[i].country;
        update_detected = true;
      }
      if (zip_codes[i].county !== existing.county) {
        console.log(`Detected Update:`.yellow, "County");
        existing.county = zip_codes[i].county;
        update_detected = true;
      }
      if (zip_codes[i].timezone !== existing.timezone) {
        console.log(`Detected Update:`.yellow, "Timezone");
        existing.timezone = zip_codes[i].timezone;
        update_detected = true;
      }
      if (zip_codes[i].stateCode !== existing.stateCode) {
        console.log(`Detected Update:`.yellow, "State Code");
        existing.stateCode = zip_codes[i].stateCode;
        update_detected = true;
      }
      if (zip_codes[i].state !== existing.state) {
        console.log(`Detected Update:`.yellow, "State Name");
        existing.state = zip_codes[i].state;
        update_detected = true;
      }
      if (zip_codes[i].agent !== existing.agent) {
        console.log(`Detected Update:`.yellow, "Shipping Agent");
        existing.agent = zip_codes[i].agent;
        update_detected = true;
      }
      if (zip_codes[i].service !== existing.service) {
        console.log(`Detected Update:`.yellow, "Shipping Service");
        existing.service = zip_codes[i].service;
        update_detected = true;
      }
      if (update_detected) {
        console.log(`Saving changes to:`.yellow.bold, zip_codes[i].code);
        try {
          await existing.save();
          console.log(`Changes saved!`.green.bold);
        } catch (err) {
          console.log(`Error saving changes:`.red.bold, err);
        }
      } else {
        console.log(`No updates detected!`.green.bold);
      }
    }
  }

  return Array.from(unique_set);
}

async function aggregateData() {
  console.log(`Initializing Aggregation report...`);

  let code_set = new Set();
  let city_set = new Set();
  let country_set = new Set();
  let county_set = new Set();
  let timezone_set = new Set();
  let county_name_set = new Set();
  let agent_set = new Set();
  let service_set = new Set();

  const top = 1000;
  let skip = 0;

  while (true) {
    const zipCodes = await BC.findZipCodes({ $top: top, $skip: skip });
    skip += zipCodes.length;
    for (let i = 0; i < zipCodes.length; i++) {
      const {
        Code,
        City,
        Country_Region_Code,
        County,
        TimeZone,
        SWC_SV_County_Name,
        SWC_SV_Shipping_Agent,
        SWC_SV_Shipping_Agent_Service,
      } = zipCodes[i];
      code_set.add(Code);
      city_set.add(City);
      country_set.add(Country_Region_Code);
      county_set.add(County);
      timezone_set.add(TimeZone);
      county_name_set.add(SWC_SV_County_Name);
      agent_set.add(SWC_SV_Shipping_Agent);
      service_set.add(SWC_SV_Shipping_Agent_Service);
    }
    if (zipCodes.length < top) {
      break;
    }
  }

  console.log(`Zip Codes:`, Array.from(code_set).length);

  console.log(`Cities:`, Array.from(city_set).length);

  console.log(`Countries:`, Array.from(country_set).length);
  console.log(`Values:`, Array.from(country_set));

  console.log(`Counties:`, Array.from(county_set).length);
  console.log(`Values:`, Array.from(county_set));

  console.log(`County Names:`, Array.from(county_name_set).length);

  console.log(`Shipping Agents:`, Array.from(agent_set).length);
  console.log(`Values:`, Array.from(agent_set));

  console.log(`Shipping Services:`, Array.from(service_set).length);
}

module.exports = { loadZipCodes, aggregateData };
