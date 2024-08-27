const asyncHandler = require("express-async-handler");
const { Account } = require("../../models");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const accounts = await Account.findAll();
    return res.json(accounts);
  }),

  create: asyncHandler(async (req, res) => {
    const {} = req.body;
  }),
};
