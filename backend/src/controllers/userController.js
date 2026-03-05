const { getAllUsers } = require("../models/userModel");

async function listUsers(req, res, next) {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      data: users
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers
};