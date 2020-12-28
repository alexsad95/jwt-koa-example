const { model, Schema } = require("mongoose");

const tokenSchema = new Schema({
  guid: { type: String, require: true },
  refreshToken: { type: String, require: true },
  date: { type: Date, default: Date.now },
});

module.exports = model("Tokens", tokenSchema);