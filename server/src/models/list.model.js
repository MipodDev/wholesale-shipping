const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const clusionSchema = new Schema({
  key: {
    type: String,
    enums: ["metafield", "tag"],
  },
  value: {
    type: String,
  },
});

const VariantSchema = new Schema({
  id: { type: String, required: true },
  sku: { type: String },
});

const ProductSchema = new Schema({
  id: { type: String, required: true },
  title: {
    type: String,
  },
  status: {
    type: String,
  },
  variants: [VariantSchema],
});

const ListSchema = new Schema({
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
  category: {
    type: String,
  },
  targeted_skus: {
    type: [String],
  },
  include: {
    type: [clusionSchema],
  },
  exclude: {
    type: [clusionSchema],
  },
  products: [ProductSchema],
});

const List = mongoose.model("Lists", ListSchema);

module.exports = List;
