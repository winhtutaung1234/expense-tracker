const { Transaction } = require("../../models");
const { Currency } = require("../../models");
const { Category } = require("../../models");
const { Account } = require("../../models");
const { User } = require("../../models");

const errResponse = require("../../utils/error/errResponse");
const currencyConverter = require("../../utils/currency/currencyConverter");
const {
  addTransactionToAccountBalance,
  updateTransactionToAccountBalance,
} = require("../../utils/account/updateAccountBalance");
const {
  getFormattedBalance,
} = require("../../utils/currency/formattedBalance");

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
        {
          model: Account,
          attributes: ["id", "balance"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return transactions;
  }

  async getTransaction(id) {
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: Currency,
          attributes: ["code", "symbol", "symbol_position", "decimal_places"],
        },
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Account,
          attributes: ["id", "balance"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return transaction;
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

    await addTransactionToAccountBalance({
      account_id,
      convertedAmount,
      transaction_type,
    });

    // Create the transaction with the converted amount and exchange rate
    const createdTransaction = await Transaction.create({
      account_id,
      category_id,
      transaction_type,
      amount: convertedAmount,
      currency_id,
      description,
      exchange_rate: exchange_rate,
    });

    const transaction = await Transaction.findByPk(createdTransaction.id, {
      include: [
        {
          model: Currency,
          attributes: ["code", "symbol", "symbol_position", "decimal_places"],
        },
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Account,
          attributes: ["id", "balance"],
        },
      ],
    });

    return transaction;
  }

  async updateTransaction(id, data, userId) {
    const { category_id, transaction_type, amount, currency_id, description } =
      data;

    const transaction = await Transaction.findByPk(id, {
      include: [{ model: Account, attributes: ["id", "user_id"] }],
    });

    if (!transaction) {
      throw errResponse("Transaction not found", 404, "transaction");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw errResponse("User not found", 404, "transaction");
    }

    if (transaction.Account.user_id !== userId) {
      throw errResponse(
        "Unauthorized to update transaction",
        403,
        "transaction"
      );
    }

    // convert appropiate currency based on account's currecny
    const { exchange_rate, convertedAmount } = await currencyConverter(
      transaction.Account.id,
      currency_id,
      amount
    );

    await updateTransactionToAccountBalance({
      account_id: transaction.Account.id,
      convertedAmount,
      transaction_type,
      transaction_id: transaction.id,
    });

    // Create the transaction with the converted amount and exchange rate
    await transaction.update({
      account_id: transaction.Account.id,
      category_id,
      transaction_type,
      amount: convertedAmount,
      currency_id,
      description,
      exchange_rate: exchange_rate,
    });

    const updatedTransaction = await Transaction.findByPk(transaction.id, {
      include: [
        {
          model: Currency,
          attributes: ["code", "symbol", "symbol_position", "decimal_places"],
        },
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Account,
          attributes: ["id", "balance"],
        },
      ],
    });

    return updatedTransaction;
  }

  async deleteTransaction(id, userId) {
    const transaction = await Transaction.findByPk(id, {
      include: [{ model: Account, attributes: ["id", "user_id", "balance"] }],
    });

    if (!transaction) {
      throw errResponse("Transaction not found", 404);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw errResponse("User not found", 404, "transaction");
    }

    if (transaction.Account.user_id !== userId) {
      throw errResponse(
        "Unauthorized to delete transaction",
        403,
        "transaction"
      );
    }

    if (transaction.transaction_type === "income") {
      transaction.Account.balance -= transaction.amount;
    } else {
      const transactionAmount = await getFormattedBalance(transaction.amount);
      let accountBalance = await getFormattedBalance(
        transaction.Account.balance
      );

      accountBalance += transactionAmount;
      transaction.Account.balance = accountBalance;
    }

    await transaction.Account.save();

    await transaction.destroy();
    return true;
  }
}

module.exports = new TransactionService();
