const { Account, Transaction, TransactionConversion } = require("../../models");
const { getFormattedBalance } = require("../currency/formattedBalance");

async function updateAccountBalance(accountId, accountBalance) {
  await Account.update(
    { balance: accountBalance },
    { where: { id: accountId } }
  );
}

async function getAccountbalance(accountId) {
  const account = await Account.findByPk(accountId);

  if (!account) {
    throw errResponse("Account not found", 404, "account");
  }

  return await getFormattedBalance(account.balance);
}

async function getOriginalBalance(accountId, transactionId) {
  const account = await Account.findByPk(accountId);
  const transaction = await Transaction.findByPk(transactionId, {
    include: [
      {
        model: TransactionConversion,
        attributes: ["converted_amount"],
      },
    ],
  });

  if (!account) throw errResponse("Account not found", 404, "account");

  if (!transaction)
    throw errResponse("Transaction not found", 404, "transaction");

  let originalBalance = await getFormattedBalance(account.balance);
  let transactionAmount = await getFormattedBalance(transaction.amount);

  if (transaction.TransactionConversion) {
    transactionAmount = await getFormattedBalance(
      transaction.TransactionConversion.converted_amount
    );
  }

  if (transaction.transaction_type === "income") {
    originalBalance -= transactionAmount;
  } else {
    originalBalance += transactionAmount;
  }

  return originalBalance;
}

module.exports = {
  updateAccountBalance,
  getAccountbalance,
  getOriginalBalance,
};
