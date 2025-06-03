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
  targeted_lists: {
    type: [ListSchema],
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
});

const State = mongoose.model("State", StateSchema);

module.exports = State;
