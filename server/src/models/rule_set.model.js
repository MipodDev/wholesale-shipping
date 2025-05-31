const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ruleSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
});

const ruleSetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rules: {
    type: [ruleSchema],
  },
});

const RuleSet = mongoose.model("RuleSet", ruleSetSchema);

module.exports = RuleSet;
