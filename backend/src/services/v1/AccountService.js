const { Account } = require("../../models");
const { Currency } = require("../../models");
const isDuplicateName = require("../../utils/account/isDuplicateName");
const errResponse = require("../../utils/error/errResponse");

class AccountService {
  async getAllAccounts(userId) {
    const accounts = await Account.findAll({
      where: { user_id: userId },
      include: Currency,
    });

    if (accounts.length === 0) {
      throw errResponse("This user has no accounts", 404);
    }

    return accounts;
  }

  async getAccount(accountId) {
    const account = await Account.findByPk(accountId, { include: Currency });

    if (!account) {
      throw errResponse("Account not found", 404);
    }

    return account;
  }

  async createAccount(userId, data) {
    await isDuplicateName("create", { user_id: userId, name: data.name });

    const createdAccount = await Account.create({ user_id: userId, ...data });
    const account = await Account.findByPk(createdAccount.id, {
      include: Currency,
    });

    return account;
  }

  async updateAccount(accountId, updatedData) {
    const account = await Account.findByPk(accountId, { include: Currency });

    if (!account) {
      throw errResponse("Account not found", 404, "account");
    }

    await isDuplicateName("update", {
      user_id: updatedData.user_id,
      name: updatedData.name,
      accountId,
    });

    await account.update({ ...updatedData });

    return account;
  }

  async deleteAccount(accountId) {
    await Account.destroy({ where: { id: accountId } });
    return true;
  }
}

module.exports = new AccountService();
