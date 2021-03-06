const uuid = require("uuid").v4;
const { hashSync } = require("bcryptjs");
const Users = require("../models/Users");

async function add(values) {
  try {
    const user = new Users(
      {
        guid: uuid(),
        login: values.login,
        password: hashSync(values.password),
      },
    );
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function find(values) {
  try {
    const user = await Users.findOne(values);
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function list() {
  try {
    const users = await Users.find();
    return users;
  } catch (error) {
    throw new Error(error);
  }
}

async function update(query, values) {
  try {
    const updetedUser = await Users.findOneAndUpdate(query, values);
    if (updetedUser) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  add,
  find,
  list,
  update,
};
