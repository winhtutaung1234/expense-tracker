const {
  Currency,
  Category,
  Account,
  Transfer,
  Transaction,
  TransactionConversion,
} = require("../../models");

const errResponse = require("../../utils/error/errResponse");
const currencyConverter = require("../../utils/currency/currencyConverter");

const {
  getFormattedBalance,
} = require("../../utils/currency/formattedBalance");

const AccountBalanceService = require("./AccountBalanceService");
const {
  getTransactionsWithAssociation,
  getTransactionWithAssociation,
} = require("../../utils/transaction/transactionUtils");

class TransactionService {
  async getAllTransactions(account_id) {
    const transactions = await getTransactionsWithAssociation(account_id);
    return transactions;
  }

  async getTransaction(id) {
    const transaction = await getTransactionWithAssociation(id);
    return transaction;
  }

  async createTransaction(transactionDatas) {
    const {
      account_id,
      transfer_account_id,
      category_id,
      transaction_type,
      amount,
      currency_id,
      date,
      description,
    } = transactionDatas;

    const account = await Account.findByPk(account_id, { include: Currency });
    const currency = await Currency.findByPk(currency_id);

    if (!account) {
      throw errResponse("Account not found", 404, "account");
    } else if (!currency) {
      throw errResponse("Currency not found", 404, "currency");
    }

    // Create the transaction with the converted amount and exchange rate
    const createdTransaction = await Transaction.create({
      account_id,
      category_id,
      transaction_type,
      amount,
      currency_id,
      date: date ? new Date(date) : new Date(),
      description,
    });

    if (account.Currency.id !== currency.id) {
      const { exchange_rate, convertedAmount, convertedCurrencyId } =
        await currencyConverter({
          accountCurrency: account.Currency,
          transactionCurrency: currency,
          amount,
        });

      await AccountBalanceService.addTransactionToAccountBalance({
        account_id,
        transfer_account_id,
        convertedAmount,
        transaction_type,
      });

      await TransactionConversion.create({
        transaction_id: createdTransaction.id,
        converted_amount: convertedAmount,
        exchange_rate,
        converted_currency_id: convertedCurrencyId,
      });
    } else {
      await AccountBalanceService.addTransactionToAccountBalance({
        account_id,
        transfer_account_id,
        convertedAmount: amount,
        transaction_type,
      });
    }

    if (transaction_type === "transfer") {
      await Transfer.create({
        transaction_id: createdTransaction.id,
        from_account_id: account_id,
        to_account_id: transfer_account_id,
      });
    }

    const transaction = await getTransactionWithAssociation(
      createdTransaction.id
    );

    return transaction;
  }

  async updateTransaction(id, data, userId) {
    const {
      account_id,
      transfer_account_id,
      category_id,
      transaction_type,
      amount,
      currency_id,
      description,
    } = data;

    const transaction = await Transaction.findByPk(id, {
      include: [{ model: Account, attributes: ["id", "user_id"] }],
    });

    if (!transaction) {
      throw errResponse("Transaction not found", 404);
    }

    if (
      transaction.Account.id.toString() !== account_id.toString() ||
      transaction.Account.user_id !== userId
    ) {
      throw errResponse(
        "Unauthorized to update transaction",
        403,
        "transaction"
      );
    }

    // convert appropiate currency based on account's currecny
    const { exchange_rate, convertedAmount, convertedCurrencyId } =
      await currencyConverter(transaction.Account.id, currency_id, amount);

    await AccountBalanceService.updateTransactionToAccountBalance({
      account_id,
      transfer_account_id,
      convertedAmount,
      transaction_type,
      transaction_id: transaction.id,
    });

    // Create the transaction with the converted amount and exchange rate
    await transaction.update({
      account_id,
      category_id,
      transaction_type,
      amount,
      converted_amount: convertedAmount,
      currency_id: convertedCurrencyId,
      date: date ? new Date(date) : new Date(),
      description,
      exchange_rate: exchange_rate,
    });

    const updatedTransaction = await getTransactionWithAssociation(
      transaction.id
    );

    return updatedTransaction;
  }

  async deleteTransaction(id, userId) {
    const transaction = await Transaction.findByPk(id, {
      include: [{ model: Account, attributes: ["id", "user_id", "balance"] }],
    });

    if (!transaction) {
      throw errResponse("Transaction not found", 404);
    }

    if (transaction.Account.user_id !== userId) {
      throw errResponse(
        "Unauthorized to delete trasaction",
        403,
        "transaction"
      );
    }

    let accountBalance = await getFormattedBalance(transaction.Account.balance);
    let transactionAmount = await getFormattedBalance(transaction.amount);

    if (transaction.transaction_type === "income") {
      accountBalance -= transactionAmount;
    } else {
      accountBalance += transactionAmount;
    }

    transaction.Account.balance = accountBalance;

    await transaction.destroy();
    await transaction.Account.save();
    return true;
  }
}

module.exports = new TransactionService();
