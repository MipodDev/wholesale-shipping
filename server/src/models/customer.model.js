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
  lists: {
    type: [ListSchema],
  },
});

const customerSchema = new Schema(
  {
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
    rules: {
      type: [RuleSchema],
    },
    site: {
      type: String,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
