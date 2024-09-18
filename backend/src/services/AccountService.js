const { Account } = require("../models");
const { Currency } = require("../models");
const { Denomination } = require("../models");
const { User } = require("../models");
const errRespones = require("../utils/error/errResponse");

class AccountService {
  async getAllAccounts(userId) {
    const accounts = await Account.findAll({
      where: { user_id: userId },
      include: Currency,
    });

    if (accounts.length === 0) {
      throw errRespones("This user has no accounts", 404);
    }

    return accounts;
  }

  async getAccount(accountId) {
    const account = await Account.findByPk(accountId, { include: Currency });

    if (!account) {
      throw errRespones("Account not found", 404);
    }

    return account;
  }

  async createAccount(userId, data) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw errRespones("User not found", 404);
    }

    const currency = await Currency.findByPk(data.currency_id);
    if (!currency) {
      throw errRespones("Currency not found", 404);
    }

    // if user has same account error will response
    const accounts = await Account.findAll({
      where: { user_id: userId },
      attributes: ["name"],
      raw: true,
    });

    console.log("accounts: ", accounts);

    const isDuplicate = accounts.some((account) => account.name === data.name);

    if (isDuplicate) {
      throw errRespones("Account name cannot be duplicate");
    }

    const denominations = await Denomination.findAll({
      where: { currency_id: currency.id },
    });

    if (denominations.length === 0) {
      throw errRespones("No denominations found for the given currency", 404);
    }

    const isValid = denominations.some((deno) => {
      return data.balance % deno.value === 0;
    });

    if (!isValid) {
      throw new Error(
        "Invalid amount for the given currency denominations",
        400
      );
    }

    const createdAccount = await Account.create({ user_id: userId, ...data });

    return createdAccount;
  }

  async updateAccount(accountId, updatedData) {
    const account = await Account.findByPk(accountId);

    if (!account) {
      throw errRespones("Account not found", 404);
    }

    const updatedAccount = await account.update(updatedData);

    return updatedAccount;
  }

  async deleteAccount(accountId) {
    const account = await Account.findByPk(accountId);

    if (!account) {
      throw errRespones("Account not found", 404);
    }

    await account.destroy();
    return true;
  }
}

module.exports = new AccountService();
