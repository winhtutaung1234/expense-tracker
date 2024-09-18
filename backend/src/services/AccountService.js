const { Account } = require("../models");
const { Currency } = require("../models");
const isDuplicateName = require("../utils/account/isDuplicateName");
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
    const currency = await Currency.findByPk(data.currency_id);

    if (!currency) {
      throw errRespones("Currency not found", 404);
    }

    await isDuplicateName("create", { user_id: userId, name: data.name });

    const createdAccount = await Account.create({ user_id: userId, ...data });
    const account = await Account.findByPk(createdAccount.id, {
      include: Currency,
    });

    return account;
  }

  async updateAccount(accountId, updatedData) {
    await isDuplicateName("update", {
      user_id: updatedData.user_id,
      name: updatedData.name,
      accountId,
    });

    const account = await Account.findByPk(accountId);

    if (!account) {
      errRespones("Account not found", 404);
    }

    const result = await account.update(updatedData);

    const updatedAccount = await Account.findByPk(result.id, {
      include: Currency,
    });
    return updatedAccount;
  }

  async deleteAccount(accountId) {
    console.log("accountId: ", accountId);
    try {
      const account = await Account.findByPk(accountId);
      console.log("fuck you all: ", account);
    } catch (err) {
      throw errRespones("fuck you all", 404);
    }
  }
}

module.exports = new AccountService();
