const { hashSync } = require("bcryptjs");
const Tokens = require("../models/Tokens");

async function add(values) {
  try {
    const token = new Tokens(
      {
        guid: values.guid,
        refreshToken: hashSync(values.refreshToken),
      },
    );
    await token.save();
    return token;
  } catch (error) {
    throw new Error(error);
  }
}

async function find(values) {
  try {
    const token = await Tokens.findOne(values);
    return token;
  } catch (error) {
    throw new Error(error);
  }
}

async function update(query, values) {
  try {
    const updetedToken = await Tokens.findOneAndUpdate(query, values);
    if (updetedToken) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
}

async function remove(values) {
  try {
    const updetedToken = await Tokens.deleteOne(values);
    if (updetedToken) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  find,
  add,
  update,
  remove,
};