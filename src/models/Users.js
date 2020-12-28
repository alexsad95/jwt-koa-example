const { model, Schema } = require("mongoose");

const usersSchema = new Schema({
  guid: { type: String, require: true },
  login: { type: String, require: true },
  password: { type: String, require: true },
  date: { type: Date, default: Date.now },
});

module.exports = model("Users", usersSchema);