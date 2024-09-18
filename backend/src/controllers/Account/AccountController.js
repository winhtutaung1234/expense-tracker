const asyncHandler = require("express-async-handler");
const { Account } = require("../../models");
const { Currency } = require("../../models");
const { User } = require("../../models");
const AccountResource = require("../../resources/AccountResource");

const {
  checkDecimalBalance,
  checkNonDecimalBalance,
} = require("../../utils/denomination/isValidBalance");
const AccountService = require("../../services/AccountService");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const { user } = req;

    const accounts = await AccountService.getAllAccounts(user.id);

    return res.json(AccountResource.collection(accounts));
  }),

  show: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const account = await AccountService.getAccount(id);
    return res.json(new AccountResource(account).exec());
  }),

  create: asyncHandler(async (req, res) => {
    const { name, balance, currency_id, description } = req.body;
    const { user } = req;

    const account = await AccountService.createAccount(user.id, {
      name,
      balance,
      currency_id,
      description,
    });

    return res.status(201).json(new AccountResource(account).exec());
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, balance, currency_id, description } = req.body;
    const { user } = req;

    try {
      await AccountService.updateAccount(id, {
        user_id: user.id,
        name,
        balance,
        currency_id,
        description,
      });
    } catch (err) {
      return res
        .status(400)
        .json({ msg: err.message || "Account update failed" });
    }
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      await AccountService.deleteAccount(id);
      return res.json({ msg: "Account deleted successfully" });
    } catch (err) {
      return res
        .status(400)
        .json({ msg: err.message || "Account delete failed" });
    }
  }),
};
