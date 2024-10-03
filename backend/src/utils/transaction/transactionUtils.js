const {
  Currency,
  Category,
  Account,
  Transfer,
  Transaction,
  TransactionConversion,
} = require("../../models");
const { getFormattedBalance } = require("../currency/formattedBalance");

async function calculateOriginalAccountBalance(accountId, transactionId) {
  const account = await Account.findByPk(accountId);
  const transaction = await Transaction.findByPk(transactionId, {
    attributes: ["transaction_type", "amount", "currency_id"],
    include: [
      {
        model: TransactionConversion,
        attributes: ["converted_amount"],
      },
    ],
  });

  if (!account) {
    throw errResponse("Account not found", 404, "account");
  } else if (!transaction) {
    throw errResponse("Transaction not found", 404, "transaction");
  }

  let originalBalance = await getFormattedBalance(account.balance);
  const transactionAmount = await getFormattedBalance(transaction.amount);
  const convertedAmount = await getFormattedBalance(
    transaction.TransactionConversion.converted_amount
  );

  if (transaction.transaction_type === "income") {
    originalBalance -=
      account.currency_id !== transaction.currency_id
        ? convertedAmount
        : transactionAmount;
  } else {
    originalBalance +=
      account.currency_id !== transaction.currency_id
        ? convertedAmount
        : transactionAmount;
  }
  return originalBalance;
}

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
  calculateOriginalAccountBalance,
  getTransactionWithAssociation,
  getTransactionsWithAssociation,
};
