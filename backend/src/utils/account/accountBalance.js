const { Account, Transaction } = require("../../models");
const { getFormattedBalance } = require("../currency/formattedBalance");
const errResponse = require("../error/errResponse");

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

async function getAccountBalanceForUpdate(accountId, transaction_id) {
  const account = await Account.findByPk(accountId);
  if (!account) {
    throw errResponse("Account not found", 404, "account");
  }

  const transaction = await Transaction.findByPk(transaction_id, {
    attributes: ["amount", "transaction_type"],
  });

  if (!transaction) {
    throw errResponse("Transaction not found", 404, "transaction");
  }

  const currenctAccountBalance = await getFormattedBalance(account.balance);
  const transactionAmount = await getFormattedBalance(transaction.amount);
  let accountBalance;

  if (transaction.transaction_type === "income") {
    accountBalance = currenctAccountBalance - transactionAmount;
  } else {
    accountBalance = currenctAccountBalance + transactionAmount;
  }

  return accountBalance;
}

module.exports = {
  updateAccountBalance,
  getAccountbalance,
  getAccountBalanceForUpdate,
};
