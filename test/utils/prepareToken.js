const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (data, options = {}) => jwt.sign(data, config.get("App.jwtConfig.secret"), options);