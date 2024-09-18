const asyncHandler = require("express-async-handler");
const AccountResource = require("../../resources/AccountResource");

const AccountService = require("../../services/AccountService");
const errRespones = require("../../utils/error/errResponses");

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
      const account = await AccountService.updateAccount(id, {
        user_id: user.id,
        name,
        balance,
        currency_id,
        description,
      });

      return res.json(new AccountResource(account).exec());
    } catch (err) {
      return res
        .status(400)
        .json({ msg: err.message || "Account update failed" });
    }
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { Account } = require("../../models");

    const account = await Account.findOne({ where: { id } });

    if (!account) {
      return res.status(404).json({ msg: "Not found" });
    }
    console.log(account);
    return res.json("fuck");
  }),
};
