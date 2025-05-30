const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
    type: Array,
  }
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;