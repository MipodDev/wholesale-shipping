const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ListSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
});

const StateSchema = new Schema({
  name: {
    type: String,
  },
  code: {
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
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  range: {
    type: String,
    enum: ["state", "city", "zip code"],
    required: true,
  },
  type: {
    type: String,
    enum: ["ban", "exemption", "registry"],
  },
  targeted_areas: {
    type: [String],
  },
  states: {
    type: [StateSchema],
  },
  cities: {
    type: [CitySchema],
  },
  zipCodes: {
    type: [String],
  },
  lists:{
    type: [ListSchema]
  },
  targeted_lists: {
    type: [ListSchema],
    required: true,
  },
  targeted_skus: {
    type: [String],
  },
});

const Rule = mongoose.model("Rules", RuleSchema);

module.exports = Rule;
