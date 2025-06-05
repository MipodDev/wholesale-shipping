const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ListSchema = new Schema({
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  id: {
    type: String,
  },
});

const CitySchema = new Schema({
  code: {
    type: String,
  },
  name: {
    type: String,
  },
});

const RuleSchema = new Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    unique: true,
  },
  range: {
    type: String,
  },
  type: {
    type: String,
  },
  cities: {
    type: [CitySchema],
  },
  zipCodes: {
    type: [String],
  },
  lists: {
    type: [ListSchema],
  },
  targeted_lists: {
    type: [ListSchema],
  },
});

const ZipCodeSchema = new Schema({
  code: {
    unique: true,
    type: String,
  },
  county: {
    type: String,
  },
});

const ServiceSchema = new Schema({
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

});

const StateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
  },
  rules: {
    type: [RuleSchema],
  },
  zipCodes: {
    type: [ZipCodeSchema],
  },
  services: {
    type: [ServiceSchema],
  },
});

const State = mongoose.model("State", StateSchema);

module.exports = State;
