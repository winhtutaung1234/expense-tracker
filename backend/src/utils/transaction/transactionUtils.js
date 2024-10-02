const {
  Currency,
  Category,
  Account,
  Transfer,
  Transaction,
  TransactionConversion,
} = require("../../models");

async function getTransactionsWithAssociation(accountId) {
  const transactions = await Transaction.findAll({
    where: { account_id: accountId },
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
  });

  return transactions;
}

async function getTransactionWithAssociation(transactionId) {
  const transaction = await Transaction.findByPk(transactionId, {
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
  });

  return transaction;
}

module.exports = {
  getTransactionWithAssociation,
  getTransactionsWithAssociation,
};
