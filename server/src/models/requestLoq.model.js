const mongoose = require("mongoose");

const originSchema = new mongoose.Schema({
  country: String,
  postal_code: String,
  province: String,
  city: String,
  address1: String,
  address2: String,
  company_name: String,
}, { _id: false });

const destinationSchema = new mongoose.Schema({
  country: String,
  postal_code: String,
  province: String,
  city: String,
  address1: String,
  address2: String,
  phone: String,
}, { _id: false });

const itemsSchema = new mongoose.Schema({
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
}, { _id: false });

const ratesSchema = new mongoose.Schema({
  service_name: String,
  service_code: String,
  total_price: String,
  currency: String,
}, { _id: false });

const rulesSchema = new mongoose.Schema({
  id: String,
  name: String,
  range: String,
  type: String,
}, { _id: false });

const approvalSchema = new mongoose.Schema({
  allow: Boolean,
  exempt: Boolean,
  reason: {
    type: String,
    default: "None"
  },
}, { _id: false });

const RequestLogSchema = new mongoose.Schema({
  req_id: String,
  site: String,
  type: String,
  request: {
    origin: originSchema,
    destination: destinationSchema,
    items: [itemsSchema],
    currency: String,
    locale: String,
  },
  rates: [ratesSchema],
  rules: [rulesSchema],
  approval: approvalSchema,
}, { timestamps: true });

const RequestLog = mongoose.model("RequestLog", RequestLogSchema);

module.exports = RequestLog;
