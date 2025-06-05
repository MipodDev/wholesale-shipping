const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ZipCodeSchema = new Schema({
  stateCode: {
    type: String,
  },
  code: {
    unique: true,
    type: String,
  },
  county: {
    type: String,
  },
});

const serviceSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  provinces: {
    type: [String],
  },
  minimum_order_value: {
    type: Number,
  },
  price: {
    type: Number,
  },
  free_shipping_threshold: {
    type: Number,
  },
  per_box_value_set: {
    type: Number,
  },
  service_name: {
    type: String,
  },
  service_code: {
    type: String,
  },
  for_zips: {
    type: [String],
  },
  zipCodes: {
    type: [ZipCodeSchema],
  },
  mapped_carrier:{
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model("Services", serviceSchema);

module.exports = Service;