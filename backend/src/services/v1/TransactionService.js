const { Transaction } = require("../../models");
const { Currency } = require("../../models");
const { Category } = require("../../models");

const errResponse = require("../../utils/error/errResponse");
const updateAccountBalance = require("../../utils/account/updateAccountBalance");
const currencyConverter = require("../../utils/currency/currencyConverter");

class TransactionService {
  async getAllTransactions(account_id) {
    const transactions = await Transaction.findAll({
      where: { account_id },
      include: [
        {
          model: Currency,
          attributes: ["code", "symbol", "symbol_position", "decimal_places"],
        },
        {
          model: Category,
          attributes: ["name"],
        },
      ],
    });

    return transactions;
  }

  async createTransaction(account_id, data) {
    const { category_id, transaction_type, amount, currency_id, description } =
      data;

    // convert appropiate currency based on account's currecny
    const { exchange_rate, convertedAmount } = await currencyConverter(
      account_id,
      currency_id,
      amount
    );

    await updateAccountBalance(account_id, convertedAmount, transaction_type);

    // Create the transaction with the converted amount and exchange rate
    const transaction = await Transaction.create({
      account_id,
      category_id,
      transaction_type,
      amount: convertedAmount,
      currency_id,
      description,
      exchange_rate: exchange_rate,
    });

    return transaction;
  }

  async updateTransaction(id, data, account_id) {
    const { category_id, transaction_type, amount, currency_id, description } =
      data;

    const transaction = await Transaction.findbyPk(id);

    if (!transaction) {
      throw errResponse("Transaction not found", 404);
    }

    if (transaction.account_id !== account_id) {
      throw errResponse("Account doesn't match to update the transaction", 400);
    }

    // convert appropiate currency based on account's currecny
    const { exchange_rate, convertedAmount } = await currencyConverter(
      account_id,
      currency_id,
      amount
    );

    await updateAccountBalance(account_id, convertedAmount, transaction_type);

    // Create the transaction with the converted amount and exchange rate
    const updatedTransaction = await transaction.update({
      account_id,
      category_id,
      transaction_type,
      amount: convertedAmount,
      currency_id,
      description,
      exchange_rate: exchange_rate,
    });

    return updatedTransaction;
  }

  async deleteTransaction(id, account_id) {
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      throw errResponse("Transaction not found", 404);
    }

    if (transaction.account_id !== account_id) {
      throw errResponse("Account doesn't match to delete the transaction", 403);
    }

    await transaction.destroy();
    return true;
  }
}

module.exports = new TransactionService();
