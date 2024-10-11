const { Account, Currency, Transaction } = require("../../models");
const AccountRepository = require("../../repositories/AccountRepository");
const errResponse = require("../../utils/error/errResponse");

class AccountService {
  async getAllAccounts(user_id) {
    try {
      const accounts = await AccountRepository.getAllAccounts(user_id);
      return accounts;
    } catch (err) {
      throw err;
    }
  }

  async getAccount(id) {
    try {
      const account = await AccountRepository.getAccountById(id);
      return account;
    } catch (err) {
      throw err;
    }
  }

  async createAccount(userId, data) {
    try {
      const account = await AccountRepository.createAccount({
        user_id: userId,
        ...data,
      });

      return account;
    } catch (err) {
      throw err;
    }
  }

  async updateAccount(id, updatedData) {
    try {
      const account = await AccountRepository.updateAccount({
        id,
        ...updatedData,
      });

      return account;
    } catch (err) {
      throw err;
    }
  }

  async destory(id) {
    try {
      await AccountRepository.deleteAccount(id);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new AccountService();
