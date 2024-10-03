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
  calculateOriginalAccountBalance,
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
    let transactionAmount = amount;

    if (!account) {
      throw errResponse("Account not found", 404, "account");
    } else if (!currency) {
      throw errResponse("Currency not found", 404, "currency");
    }

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

      // change the amount of transaction amount for account balance
      transactionAmount = convertedAmount;

      // added transaction conversion for different currencies
      await TransactionConversion.create({
        transaction_id: createdTransaction.id,
        converted_amount: convertedAmount,
        exchange_rate,
        converted_currency_id: convertedCurrencyId,
      });
    }

    if (transaction_type === "transfer") {
      await Transfer.create({
        transaction_id: createdTransaction.id,
        from_account_id: account_id,
        to_account_id: transfer_account_id,
      });
    }

    // add transaction amount to account blance
    await AccountBalanceService.addTransactionToAccountBalance({
      account_id,
      transfer_account_id,
      convertedAmount: transactionAmount,
      transaction_type,
    });

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
      date,
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

    const account = await Account.findByPk(account_id, { include: Currency });
    const currency = await Currency.findByPk(currency_id);

    if (!account) {
      throw errResponse("Account not found", 404, "account");
    } else if (!currency) {
      throw errResponse("Currency not found", 404, "currency");
    }

    if (account.currency_id.toString() !== currency_id.toString()) {
      const { exchange_rate, convertedAmount, convertedCurrencyId } =
        await currencyConverter({
          accountCurrency: account.Currency,
          transactionCurrency: currency,
          amount,
        });

      await AccountBalanceService.updateTransactionToAccountBalance({
        account_id,
        transfer_account_id,
        convertedAmount,
        transaction_type,
        transaction_id: transaction.id,
      });

      await TransactionConversion.update(
        {
          converted_amount: convertedAmount,
          exchange_rate,
          converted_currency_id: convertedCurrencyId,
        },
        {
          where: { transaction_id: transaction.id },
        }
      );
    } else {
      await AccountBalanceService.updateTransactionToAccountBalance({
        account_id,
        transfer_account_id,
        convertedAmount: amount,
        transaction_type,
        transaction_id: transaction.id,
      });
    }

    await transaction.update({
      account_id,
      category_id,
      transaction_type,
      amount,
      currency_id,
      date: date ? new Date(date) : new Date(),
      description,
    });
    const updatedTransaction = await getTransactionWithAssociation(
      transaction.id
    );

    return updatedTransaction;
  }

  async deleteTransaction(id) {
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: Account,
          attributes: ["id", "balance"],
        },
        { model: TransactionConversion },
      ],
    });

    const originalBalance = await calculateOriginalAccountBalance(
      transaction.Account.id,
      transaction.id
    );

    transaction.Account.balance = originalBalance;

    await transaction.destroy();
    await transaction.TransactionConversion.destroy();
    await transaction.Account.save();
    return true;
  }
}

module.exports = new TransactionService();
