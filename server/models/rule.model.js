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
  name: {
    type: String,
    required: true,
    unique: true,
  },
  range: {
    type: String,
    required: true,

  },
  targeted_areas: {
    type: [String],
    required: true,

  },
  targeted_lists: [ListSchema],
  
  targeted_skus: {
    type: [String],
  },
});

const Rule = mongoose.model("Rules", RuleSchema);

module.exports = Rule;