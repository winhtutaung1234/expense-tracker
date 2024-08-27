const asyncHandler = require("express-async-handler");
const { Account } = require("../../models");
const { Currency } = require("../../models");
const { User } = require("../../models");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const accounts = await Account.findAll({ include: [Currency] });
    return res.json(accounts);
  }),

  create: asyncHandler(async (req, res) => {
    const { user_id, name, balance, currency_id, description } = req.body;

    const user = await User.findByPk(user_id);
    if (user)
      return res.status(400).json({ msg: `User not found with id ${user_id}` });

    const currency = await Currency.findByPk(currency_id);
    if (currency)
      return res
        .status(400)
        .json({ msg: `Currency not found with id ${currency_id}` });

    const account = await Account.create({
      user_id,
      name,
      balance,
      currency_id,
      description,
    });

    return res.status(201).json(account);
  }),
};
