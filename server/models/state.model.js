const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StateSchema = new Schema({
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
  status: {
    type: String,
  },
});

const State = mongoose.model("State", StateSchema);

module.exports = State;
