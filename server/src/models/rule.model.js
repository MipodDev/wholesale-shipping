const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
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
  },  
  type: {
    type: String,
  },
  targeted_areas: {
    type: [String],
  },
  targeted_lists: { type: [ListSchema] },

  targeted_skus: {
    type: [String],
  },
});

const Rule = mongoose.model("Rules", RuleSchema);

module.exports = Rule;
