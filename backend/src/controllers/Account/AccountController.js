const asyncHandler = require("express-async-handler");
const { Account } = require("../../models");
const { Currency } = require("../../models");
const { User } = require("../../models");
const AccountResource = require("../../resources/AccountResource");

const {
  checkDecimalBalance,
  checkNonDecimalBalance,
} = require("../../utils/denomination/isValidBalance");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const { user } = req;

    const accounts = await Account.findAll({
      where: { user_id: user.id },
      include: [Currency],
    });

    return res.json(AccountResource.collection(accounts));
  }),

  show: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const account = await Account.findByPk(id);
    return res.json(new AccountResource(account).exec());
  }),

  create: asyncHandler(async (req, res) => {
    const { name, balance, currency_id, description } = req.body;
    const { user } = req;

    const userExists = await User.findByPk(user.id);
    if (!userExists) {
      return res.status(400).json({ msg: `User not found with id ${user.id}` });
    }

    const currency = await Currency.findByPk(currency_id);
    if (!currency) {
      return res
        .status(400)
        .json({ msg: `Currency not found with id ${currency_id}` });
    }

    // if user has same account error will response
    const accounts = await Account.findAll({
      where: { user_id: user.id },
      attributes: ["name"],
      raw: true,
    });

    const isDuplicate = accounts.some((account) => account.name === name);

    if (isDuplicate) {
      return res.status(400).json({ msg: "Account name cannot be duplicate" });
    }

    // Validate balance
    if (balance.toString().includes(".")) {
      const isValidDecimal = await checkDecimalBalance(balance, currency_id);
      if (!isValidDecimal) {
        return res
          .status(400)
          .json({ msg: "Invalid decimal balance for this currency" });
      }
    } else {
      const isValidNonDecimal = await checkNonDecimalBalance(
        balance,
        currency_id
      );
      if (!isValidNonDecimal) {
        return res
          .status(400)
          .json({ msg: "Invalid non-decimal balance for this currency" });
      }
    }

    const account = await Account.create({
      user_id: user.id,
      name,
      balance,
      currency_id,
      description,
    });

    return res.status(201).json(account);
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const account = await Account.findByPk(id);
    if (!account) return res.status(404).json({ msg: "Account not found" });

    await account.update(req.body);

    return res.json({ msg: "Account updated successfully" });
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const account = await Account.findOne({ where: { id } });

    await account.destroy();
    return res.json({ msg: "Account deleted successfully" });
  }),
};
