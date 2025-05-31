const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  country: String,
  postal_code: String,
  province: String,
  city: String,
  name: String,
  address1: String,
  address2: String,
  address3: String,
  latitude: Number,
  longitude: Number,
  phone: String,
  fax: String,
  email: String,
  address_type: String,
  company_name: String,
});

const itemSchema = new mongoose.Schema({
  name: String,
  sku: String,
  quantity: Number,
  grams: Number,
  price: Number,
  vendor: String,
  requires_shipping: Boolean,
  taxable: Boolean,
  fulfillment_service: String,
  product_id: Number,
  variant_id: Number,
});

const rateSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: String,
  },
});

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
  },
});

const RequestLogSchema = new mongoose.Schema(
  {
    req_id: {
      type: String,
    },
    site: {
      type: String,
    },
    request: {
      origin: addressSchema,
      destination: addressSchema,
      items: [itemSchema],
      currency: String,
      locale: String,
    },
    response: {
      rates: [rateSchema],
      rulesApplied: [ruleSchema],
    },
  },
  { timestamps: true }
);

const RequestLog = mongoose.model("RequestLog", RequestLogSchema);

module.exports = RequestLog;
