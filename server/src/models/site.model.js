const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SiteSchema = new Schema(
  {
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
    my_shopify_url: {
      type: String,
      required: true,
      unique: true,
    },
    gid: {
      type: String,
    },

    app_name: {
      type: String,
    },

    callbackUrl: {
      type: String,
    },

    active: {
      type: Boolean,
    },
    supportsServiceDiscovery: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Site = mongoose.model("Site", SiteSchema);

module.exports = Site;
