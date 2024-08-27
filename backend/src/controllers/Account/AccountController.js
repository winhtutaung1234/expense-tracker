const asyncHandler = require("express-async-handler");
const { Account } = require("../../models");
const { Currency } = require("../../models");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const accounts = await Account.findAll({ include: [Currency] });
    return res.json(accounts);
  }),
};
