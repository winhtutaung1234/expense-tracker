const { Account, Transaction } = require("../../models");

const {
  getFormattedBalance,
} = require("../../utils/currency/formattedBalance");

const {
  performTransaction,
} = require("../../utils/account/performTransaction");
const {
  getAccountbalance,
  getAccountBalanceForUpdate,
} = require("../../utils/account/accountBalance");
const errResponse = require("../../utils/error/errResponse");

class AccountBalanceService {
  async addTransactionToAccountBalance({
    account_id,
    transfer_account_id = null,
    convertedAmount,
    transaction_type,
  }) {
    const accountBalance = await getAccountbalance(account_id);
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

    const accountBalance = await getAccountBalanceForUpdate(
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
}

module.exports = new AccountBalanceService();
