const { Account, Currency } = require("../models");
const isDuplicateName = require("../utils/account/isDuplicateName");
const errResponse = require("../utils/error/errResponse");

class AccountRepository {
  async getAllAccounts(user_id) {
    try {
      const accounts = await Account.findAll({
        where: { user_id },
        include: Currency,
        order: [["created_at", "DESC"]],
      });
      return accounts;
    } catch {
      throw errResponse("Faile to fetch the accounts", 500, "account");
    }
  }

  async getAccountById(id) {
    try {
      const account = await Account.findByPk(id, { include: Currency });
      return account;
    } catch {
      throw errResponse("Failed to fetch account", 500, "account");
    }
  }

  async createAccount(data) {
    const duplicate = await isDuplicateName("create", data);
    if (duplicate)
      throw errResponse("Account name cannot be duplicate", 400, "account");

    try {
      const createdAccount = await Account.create(data);
      const account = await Account.findByPk(createdAccount.id, {
        include: Currency,
      });
      return account;
    } catch {
      throw errResponse("Fail to create account", 500, "account");
    }
  }

  async updateAccount(data) {
    const account = await Account.findByPk(data.id, { include: Currency });

    if (!account) throw errResponse("Account not found", 404, "account");

    const duplicate = await isDuplicateName("update", data);
    if (duplicate)
      throw errResponse("Account name cannot be duplicate", 400, "account");

    try {
      await account.update(data);

      return account;
    } catch {
      throw errResponse("Failed to update account", 500, "account");
    }
  }

  async deleteAccount(id) {
    try {
      await Account.destroy({ where: { id } });
    } catch {
      throw errResponse("Failed to delete account", 500, "account");
    }
  }
}

module.exports = new AccountRepository();
