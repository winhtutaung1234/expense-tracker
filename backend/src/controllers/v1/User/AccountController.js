const asyncHandler = require("express-async-handler");
const AccountResource = require("../../../resources/AccountResource");
const AccountService = require("../../../services/v1/AccountService");

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

    const account = await AccountService.updateAccount(id, {
      user_id: user.id,
      name,
      balance,
      currency_id,
      description,
    });

    return res.json(new AccountResource(account).exec());
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;

    await AccountService.deleteAccount(id);

    return res.sendStatus(204);
  }),
};
