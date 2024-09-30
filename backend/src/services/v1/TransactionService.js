const { Transaction } = require("../../models");
const { Currency, Category, Account, Transfer } = require("../../models");

const errResponse = require("../../utils/error/errResponse");
const currencyConverter = require("../../utils/currency/currencyConverter");

const {
  getFormattedBalance,
} = require("../../utils/currency/formattedBalance");

const AccountBalanceService = require("./AccountBalanceService");

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
          attributes: ["name", "text_color", "background_color"],
        },
        {
          model: Transfer,
          attributes: ["from_account_id", "to_account_id"],
          include: [
            {
              model: Account,
              as: "fromAccount",
              attributes: ["name"],
            },
            {
              model: Account,
              as: "toAccount",
              attributes: ["name"],
            },
          ],
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
          attributes: ["name", "text_color", "background_color"],
        },
        {
          model: Account,
          attributes: ["id", "balance"],
        },
        {
          model: Transfer,
          attributes: ["from_account_id", "to_account_id"],
          include: [
            {
              model: Account,
              as: "fromAccount",
              attributes: ["name"],
            },
            {
              model: Account,
              as: "toAccount",
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

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
      description,
    } = transactionDatas;

    // convert appropiate currency based on account's currecny
    const { exchange_rate, convertedAmount, convertedCurrencyId } =
      await currencyConverter(account_id, currency_id, amount);

    await AccountBalanceService.addTransactionToAccountBalance({
      account_id,
      transfer_account_id,
      convertedAmount,
      transaction_type,
    });

    // Create the transaction with the converted amount and exchange rate
    const createdTransaction = await Transaction.create({
      account_id,
      category_id,
      transaction_type,
      amount: convertedAmount,
      currency_id: convertedCurrencyId,
      description,
      exchange_rate: exchange_rate,
    });

    await Transfer.create({
      transaction_id: createdTransaction.id,
      from_account_id: account_id,
      to_account_id: transfer_account_id,
    });

    const transaction = await Transaction.findByPk(createdTransaction.id, {
      include: [
        {
          model: Currency,
          attributes: ["code", "symbol", "symbol_position", "decimal_places"],
        },
        {
          model: Category,
          attributes: ["name", "text_color", "background_color"],
        },
        {
          model: Transfer,
          attributes: ["from_account_id", "to_account_id"],
        },
        {
          model: Transfer,
          attributes: ["from_account_id", "to_account_id"],
          include: [
            {
              model: Account,
              as: "fromAccount",
              attributes: ["name"],
            },
            {
              model: Account,
              as: "toAccount",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

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
      amount: convertedAmount,
      currency_id: convertedCurrencyId,
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
          attributes: ["name", "text_color", "background_color"],
        },
        {
          model: Transfer,
          attributes: ["from_account_id", "to_account_id"],
          include: [
            {
              model: Account,
              as: "fromAccount",
              attributes: ["name"],
            },
            {
              model: Account,
              as: "toAccount",
              attributes: ["name"],
            },
          ],
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
