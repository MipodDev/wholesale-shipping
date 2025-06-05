const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ZipCodeSchema = new Schema({
  stateCode: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  county: {
    type: String,
  },
});

const ZipCode = mongoose.model("ZipCode", ZipCodeSchema);

module.exports = ZipCode;
