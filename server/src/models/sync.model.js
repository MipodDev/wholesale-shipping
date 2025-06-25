const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SyncSchema = new Schema(
  {
    table: { type: String, unique: true },
    status: { type: String },
  },
  { timestamps: true }
);

const SyncRecords = mongoose.model("SyncRecords", SyncSchema);

module.exports = SyncRecords;
