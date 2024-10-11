const {
  Transaction,
  TransactionConversion,
  Currency,
  Category,
  Transfer,
  Account,
} = require("../models");

class TransactionRepository {
  async getTransactions(account_id, t) {
    try {
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
          {
            model: TransactionConversion,
            attributes: [
              "converted_amount",
              "converted_currency_id",
              "exchange_rate",
            ],
          },
        ],
        order: [["created_at", "DESC"]],
        transaction: t,
      });

      return transactions;
    } catch (err) {
      throw errResponse("Failed to fetch transaction", 500, "transaction");
    }
  }

  async getTransactionById(id, t) {
    try {
      const transactionData = await Transaction.findByPk(id, {
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
          {
            model: TransactionConversion,
            attributes: [
              "converted_amount",
              "converted_currency_id",
              "exchange_rate",
            ],
          },
        ],
        transaction: t,
      });

      return transactionData;
    } catch (err) {
      throw errResponse("Failed to fetch transactions", 500, "transaction");
    }
  }

  async createTransaction(data, t) {
    try {
      const transactionData = await Transaction.create(data, {
        transaction: t,
      });
      return transactionData;
    } catch (err) {
      throw errResponse("Transaction create failed", 500, "transaction");
    }
  }

  async updateTransaction(id, data, t) {
    try {
      const transactionData = await Transaction.findByPk(id, {
        transaction: t,
      });

      if (!transactionData)
        throw errResponse("Transaction not found", 404, "transaction");

      await transactionData.update(data, { transaction: t });

      return transactionData;
    } catch (err) {
      throw errResponse("Transaction update failed", 500, "transaction");
    }
  }

  async deleteTransaction(id, t) {
    try {
      await Transaction.destroy({ where: { id }, transaction: t });
      return true;
    } catch (err) {
      throw errResponse("Transaction delete failed", 500, "transaction");
    }
  }
}

module.exports = new TransactionRepository();
