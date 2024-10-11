const { Account, Transaction } = require("../../models");

const {
  getFormattedBalance,
} = require("../../utils/currency/formattedBalance");

const {
  performTransaction,
} = require("../../utils/account/performTransaction");

const errResponse = require("../../utils/error/errResponse");
const AccountRepository = require("../../repositories/AccountRepository");
const TransactionRepository = require("../../repositories/TransactionRepository");

class AccountBalanceService {
  async addTransactionToAccountBalance({
    account_id,
    transfer_account_id = null,
    convertedAmount,
    transaction_type,
  }) {
    const account = await AccountRepository.getAccountById(account_id);
    const accountBalance = await getFormattedBalance(account.balance);
    const amount = await getFormattedBalance(convertedAmount);

    await performTransaction({
      transactionType: transaction_type,
      accountId: account_id,
      accountBalance,
      amount,
      transferAccountId: transfer_account_id,
    });
  }

  async updateTransactionToAccountBalance({
    account_id,
    transfer_account_id = null,
    convertedAmount,
    transaction_type,
    transaction_id,
  }) {
    const transaction = await Transaction.findByPk(transaction_id);
    if (!transaction) {
      throw errResponse("Transaction not found", 404, "transaction");
    }

    const accountBalance = await this.getOriginalAccountBalance(
      account_id,
      transaction_id
    );

    const amount = await getFormattedBalance(convertedAmount);

    if (transaction_type === "transfer") {
      const transactionAmount = await getFormattedBalance(transaction.amount);
      const transferAccount = await Account.findByPk(transfer_account_id);

      let transferAccountBalance = await getFormattedBalance(
        transferAccount.balance
      );

      transferAccountBalance -= transactionAmount;
      await transferAccount.update({ balance: transferAccountBalance });
    }

    await performTransaction({
      transactionType: transaction_type,
      accountId: account_id,
      accountBalance,
      amount,
      transferAccountId: transfer_account_id,
    });
  }

  // getOriginal Balance
  async getOriginalAccountBalance(account_id, transaction_id) {
    try {
      const account = await AccountRepository.getAccountById(account_id);
      const transaction = await TransactionRepository.getTransactionById(
        transaction_id
      );

      if (!account) throw errResponse("Account not found", 404, "account");
      if (!transaction)
        throw errResponse("Transaction not found", 404, "transaction");

      const originalBalance = await this.calculateOriginalAccountBalance(
        account,
        transaction
      );

      return originalBalance;
    } catch (err) {
      throw err;
    }
  }

  // calculation to get the original account balance
  async calculateOriginalAccountBalance(account, transaction) {
    try {
      let originalBalance = await getFormattedBalance(account.balance);
      let transactionAmount = await getFormattedBalance(transaction.amount);

      if (transaction.TransactionConversion) {
        transactionAmount = await getFormattedBalance(
          transaction.TransactionConversion.converted_amount
        );
      }

      if (transaction.transaction_type === "income") {
        originalBalance -= transactionAmount;
      } else {
        originalBalance += transactionAmount;
      }

      return originalBalance;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = new AccountBalanceService();
