const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ZipCodeSchema = new Schema(
  {
    code: { type: String, unique: true },
    city: { type: String },
    country: { type: String },
    county: { type: String },
    timezone: { type: String },
    stateCode: { type: String },
    state: { type: String },
    agent: { type: String },
    service: { type: String },
  },
  { timestamps: true }
);

const ZipCode = mongoose.model("ZipCode", ZipCodeSchema);

module.exports = ZipCode;
