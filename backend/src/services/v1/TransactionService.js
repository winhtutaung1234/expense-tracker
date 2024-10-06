const {
  Currency,
  Category,
  Account,
  Transfer,
  Transaction,
  TransactionConversion,
  sequelize,
} = require("../../models");

const errResponse = require("../../utils/error/errResponse");
const currencyConverter = require("../../utils/currency/currencyConverter");

const AccountBalanceService = require("./AccountBalanceService");
const {
  getTransactionsWithAssociation,
  getTransactionWithAssociation,
} = require("../../utils/transaction/transactionUtils");
const { errorHandler } = require("../../middlewares/common/errorHandler");
const { getOriginalBalance } = require("../../utils/account/accountBalance");

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

    try {
      return await sequelize.transaction(async (t) => {
        const account = await Account.findByPk(account_id, {
          include: Currency,
        });
        const currency = await Currency.findByPk(currency_id);
        let transactionAmount = amount;

        if (!account) {
          throw errResponse("Account not found", 404, "account");
        }
        if (!currency) {
          throw errResponse("Currency not found", 404, "currency");
        }

        const createdTransaction = await Transaction.create(
          {
            account_id,
            category_id,
            transaction_type,
            amount,
            currency_id,
            date: date ? new Date(date) : new Date(),
            description,
          },
          { transaction: t }
        );

        if (account.Currency.id !== currency.id) {
          const { exchange_rate, convertedAmount, convertedCurrencyId } =
            await currencyConverter({
              accountCurrency: account.Currency,
              transactionCurrency: currency,
              amount,
            });

          transactionAmount = convertedAmount;

          await TransactionConversion.create(
            {
              transaction_id: createdTransaction.id,
              converted_amount: convertedAmount,
              exchange_rate,
              converted_currency_id: convertedCurrencyId,
            },
            { transaction: t }
          );
        }

        if (transaction_type === "transfer") {
          await Transfer.create(
            {
              transaction_id: createdTransaction.id,
              from_account_id: account_id,
              to_account_id: transfer_account_id,
            },
            { transaction: t }
          );
        }

        await AccountBalanceService.addTransactionToAccountBalance({
          account_id,
          transfer_account_id,
          convertedAmount: transactionAmount,
          transaction_type,
        });

        console.log("createdTransaction Id: ", createdTransaction.id);

        const transaction = await getTransactionWithAssociation(
          createdTransaction.id,
          t
        );

        console.log("transaction from create : ", transaction);

        return transaction;
      });
    } catch (err) {
      throw err;
    }
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

    try {
      return await sequelize.transaction(async (t) => {
        // Fetch the transaction with related account
        const transaction = await Transaction.findByPk(id, {
          include: [{ model: Account, attributes: ["id", "user_id"] }],
          transaction: t,
        });

        if (!transaction) {
          throw errResponse("Transaction not found", 404);
        }

        // Check authorization
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

        // Fetch the account with currency
        const account = await Account.findByPk(account_id, {
          include: Currency,
          transaction: t,
        });

        // Fetch the currency
        const currency = await Currency.findByPk(currency_id, {
          transaction: t,
        });

        if (!account) {
          throw errResponse("Account not found", 404, "account");
        } else if (!currency) {
          throw errResponse("Currency not found", 404, "currency");
        }

        // currencyConverter when account's currency and currency are not the same
        if (account.currency_id.toString() !== currency_id.toString()) {
          const { exchange_rate, convertedAmount, convertedCurrencyId } =
            await currencyConverter({
              accountCurrency: account.Currency,
              transactionCurrency: currency,
              amount,
            });

          // Update the account balance
          await AccountBalanceService.updateTransactionToAccountBalance({
            account_id,
            transfer_account_id,
            convertedAmount,
            transaction_type,
            transaction_id: transaction.id,
            transaction: t,
          });

          // Update TransactionConversion with the transaction
          await TransactionConversion.update(
            {
              converted_amount: convertedAmount,
              exchange_rate,
              converted_currency_id: convertedCurrencyId,
            },
            {
              where: { transaction_id: transaction.id },
              transaction: t,
            }
          );
        } else {
          // No conversion needed, but still update account balance within the transaction
          await AccountBalanceService.updateTransactionToAccountBalance({
            account_id,
            transfer_account_id,
            convertedAmount: amount,
            transaction_type,
            transaction_id: transaction.id,
            transaction: t,
          });
        }

        // Update the transaction,
        await transaction.update(
          {
            account_id,
            category_id,
            transaction_type,
            amount,
            currency_id,
            date: date ? new Date(date) : new Date(),
            description,
          },
          { transaction: t }
        );

        // Fetch the updated transaction with associations
        const updatedTransaction = await getTransactionWithAssociation(
          transaction.id
        );

        return updatedTransaction;
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteTransaction(id) {
    try {
      return await sequelize.transaction(async (t) => {
        const transaction = await Transaction.findByPk(id, {
          include: [
            {
              model: Account,
              attributes: ["id", "balance"],
            },
            { model: TransactionConversion },
          ],
          transaction: t,
        });

        const originalBalance = await getOriginalBalance(
          transaction.Account.id,
          transaction.id
        );

        transaction.Account.balance = originalBalance;

        if (transaction.TransactionConversion) {
          await transaction.TransactionConversion.destroy({ transaction: t });
        }

        await transaction.destroy({ transaction: t });
        await transaction.Account.save({ transaction: t });
        return true;
      });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new TransactionService();
