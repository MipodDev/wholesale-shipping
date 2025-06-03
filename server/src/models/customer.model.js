const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ruleSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  name: {
    range: String,
  },
});

const customerSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  customerNumber: {
    type: String,
  },
  ruleSets: {
    type: [ruleSchema],
  },
  site: {
    type: String,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
