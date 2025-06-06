const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VariantSchema = new Schema({
  id: { type: String, required: true },
  sku: { type: String },
});

const ProductSchema = new Schema({
  product_id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
  },
  status: {
    type: String,
  },
  category: {
    type: String,
  },
  variantsCount: {
    type: Number,
  },
  unique_skus: {
    type: [String],
  },
  variants: [VariantSchema],
});

const Product = mongoose.model("Products", ProductSchema);

module.exports = Product;