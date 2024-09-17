const { Account } = require("../models");
const { Currency } = require("../models");
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

    if (user) {
      throw errRespones("User not found", 404);
    }
  }

  async updateAccount(accountId, updatedData) {
    const account = await Account.findByPk(accountId);

    if (!account) {
      throw errRespones("Account not found", 404);
    }

    await account.update(updatedData);
    return true;
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
