const { Account, Transaction } = require("../../models");
const { getFormattedBalance } = require("../currency/formattedBalance");
const errRespones = require("../error/errResponse");

async function addTransactionToAccountBalance({
  account_id,
  convertedAmount,
  transaction_type,
}) {
  const account = await Account.findByPk(account_id);
  if (!account) {
    throw errRespones("Account not found", 404);
  }

  const accountBalance = await getFormattedBalance(account.balance);
  const amount = await getFormattedBalance(convertedAmount);

  let newBalance;

  if (transaction_type === "expense" && accountBalance > amount) {
    newBalance = accountBalance - amount;
  } else if (transaction_type === "income") {
    newBalance = accountBalance + amount;
  } else {
    throw errRespones("Insufficient fund", 400);
  }

  await account.update({ balance: newBalance });

  return true;
}

async function updateTransactionToAccountBalance({
  account_id,
  convertedAmount,
  transaction_type,
  transaction_id,
}) {
  const account = await Account.findByPk(account_id);
  if (!account) {
    throw errRespones("Account not found", 404);
  }

  const transaction = await Transaction.findByPk(transaction_id);
  if (!transaction) {
    throw errRespones("Transaction not found", 404);
  }

  // Parse the current balance as a number
  const amount = await getFormattedBalance(convertedAmount);
  const isIncome = transaction.transaction_type === "income";
  const transactionAmount = await getFormattedBalance(transaction.amount);

  let accountBalance = await getFormattedBalance(account.balance);
  let newBalance;

  if (isIncome) {
    accountBalance -= transactionAmount;
  } else {
    accountBalance += transactionAmount;
  }

  if (transaction_type === "income") {
    newBalance = accountBalance + amount;
  } else {
    newBalance = accountBalance - amount;
  }

  await account.update({ balance: await getFormattedBalance(newBalance) });

  return true;
}

module.exports = {
  addTransactionToAccountBalance,
  updateTransactionToAccountBalance,
};
