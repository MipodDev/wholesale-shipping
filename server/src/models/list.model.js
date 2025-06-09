const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const clusionSchema = new Schema({
  key: {
    type: String,
    enums: ["category", "tag", "flavor"],
  },
  value: {
    type: String,
  },
});

const VariantSchema = new Schema({
  id: { type: String, required: true },
  sku: { type: String },
  title: { type: String },
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

const ListSchema = new Schema(
  {
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
    skus: {
      type: [String],
    },
    include: {
      type: [clusionSchema],
    },
    exclude: {
      type: [clusionSchema],
    },
    products: [ProductSchema],
  },
  { timestamps: true }
);

const List = mongoose.model("Lists", ListSchema);

module.exports = List;
