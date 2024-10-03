const { Account, Transaction, TransactionConversion } = require("../../models");
const { getFormattedBalance } = require("../currency/formattedBalance");
const errResponse = require("../error/errResponse");
const {
  calculateOriginalAccountBalance,
} = require("../transaction/transactionUtils");

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
  const accountBalance = await calculateOriginalAccountBalance(
    accountId,
    transaction_id
  );
  return accountBalance;
}

module.exports = {
  updateAccountBalance,
  getAccountbalance,
  getAccountBalanceForUpdate,
  calculateOriginalAccountBalance,
};
