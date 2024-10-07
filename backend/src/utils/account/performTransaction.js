const errResponse = require("../error/errResponse");
const { updateAccountBalance, getAccountbalance } = require("./accountBalance");

async function performTransaction({
  transactionType,
  accountId,
  accountBalance,
  amount,
  transferAccountId,
}) {
  switch (transactionType) {
    case "income":
      return await performIncome({ accountId, accountBalance, amount });
    case "expense":
      return await performExpense({ accountId, accountBalance, amount });
    case "transfer":
      return await performTransfer({
        accountId,
        accountBalance,
        amount,
        transferAccountId,
      });
    default:
      throw errResponse("Invalid transaction", 400, "transaction");
  }
}

async function performIncome({ accountId, accountBalance, amount }) {
  accountBalance += amount;
  await updateAccountBalance(accountId, accountBalance);
  return true;
}

async function performExpense({ accountId, accountBalance, amount }) {
  if (accountBalance < amount) {
    throw errResponse("Insufficient amount", 400, "transaction");
  }

  accountBalance -= amount;
  await updateAccountBalance(accountId, accountBalance);
  return true;
}

async function performTransfer({
  accountId,
  accountBalance,
  amount,
  transferAccountId,
}) {
  if (accountBalance < amount) {
    throw errResponse("Insufficient amount to transfer", 400, "transaction");
  } else if (accountId.toString() === transferAccountId.toString()) {
    throw errResponse("Cannot transfer to same account", 400, "transaction");
  }

  let transferAccountBalance = await getAccountbalance(transferAccountId);

  accountBalance -= amount;
  transferAccountBalance += amount;

  await updateAccountBalance(accountId, accountBalance);
  await updateAccountBalance(transferAccountId, transferAccountBalance);
}

module.exports = {
  performTransaction,
  performIncome,
  performExpense,
  performTransfer,
};
