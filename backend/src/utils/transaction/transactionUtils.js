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

async function getTransactionWithAssociation(transactionId, t) {
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
    transaction: t,
  });

  return transaction;
}

async function handleCurrencyConversion({
  transactionData,
  conversionData,
  t,
}) {
  const { converted_amount, exchange_rate, converted_currency_id } =
    conversionData;

  const { transaction_id, transaction_conversion_id } = transactionData;

  if (transaction_conversion_id) {
    await TransactionConversion.update(
      {
        converted_amount,
        exchange_rate,
        converted_currency_id,
      },
      {
        where: { transaction_id: transaction_id },
        transaction: t,
      }
    );
  } else {
    await TransactionConversion.create({
      transaction_id,
      converted_amount,
      exchange_rate,
      converted_currency_id,
    });
  }
}

module.exports = {
  getTransactionWithAssociation,
  getTransactionsWithAssociation,
  handleCurrencyConversion,
};
