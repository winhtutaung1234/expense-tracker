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

  if (transaction_type === "expense" && convertedAmount > account.balance) {
    throw errRespones("Insufficent fund", 400);
  }

  let newBalance;

  if (transaction_type === "income") {
    newBalance =
      (await getFormattedBalance(account.balance)) +
      (await getFormattedBalance(convertedAmount));
  } else if (transaction_type === "expense") {
    newBalance = (await getFormattedBalance(account.balance)) - convertedAmount;
  }

  console.log("new balance: ", newBalance, " type: ", typeof newBalance);

  await account.update({ balance: newBalance });

  return true;
}

// async function updateTransactionToAccountBalance({
//   account_id,
//   convertedAmount,
//   transaction_type,
//   transaction_id,
// }) {
//   const account = await Account.findByPk(account_id);
//   if (!account) {
//     throw errRespones("Account not found", 404);
//   }

//   const transaction = await Transaction.findByPk(transaction_id);
//   if (!transaction) {
//     throw errRespones("Transaction not found", 404);
//   }

//   let newBalance = await getFormattedBalance(account.balance);

//   if (transaction_type !== transaction.transaction_type) {
//     console.log("running...");
//     let originalBalance = await getFormattedBalance(account.balance);
//     console.log(
//       "currenct balance: ",
//       originalBalance,
//       " type: ",
//       typeof originalBalance
//     );

//     if (transaction.transaction_type === "income") {
//       originalBalance -= await getFormattedBalance(transaction.amount);
//     } else {
//       originalBalance += await getFormattedBalance(transaction.amount);
//     }
//     console.log(
//       "originalBalance: ",
//       originalBalance,
//       "type: ",
//       typeof originalBalance
//     );

//     if (transaction_type === "income") {
//       newBalance = originalBalance + Number(convertedAmount);
//     } else {
//       newBalance = originalBalance - Number(convertedAmount);
//     }
//     console.log("newBalance: ", newBalance, " type: ", typeof newBalance);
//   }

//   console.log(
//     "new Balane for update: ",
//     newBalance,
//     " type: ",
//     typeof newBalance
//   );
//   await account.update({ balance: newBalance });

//   return true;
// }

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
  let newBalance = await getFormattedBalance(account.balance);

  // If the transaction type has changed, adjust the balance accordingly
  const originalAmount = await getFormattedBalance(transaction.amount);
  const isIncome = transaction.transaction_type === "income";

  // Adjust the balance based on the original transaction type
  newBalance += isIncome ? -originalAmount : originalAmount;

  // Update the balance based on the new transaction type
  newBalance +=
    transaction_type === "income"
      ? await getFormattedBalance(convertedAmount)
      : -convertedAmount;

  console.log(
    "New balance from update: ",
    newBalance,
    "type: ",
    typeof newBalance
  );

  // Update the account balance in the database
  await account.update({ balance: await getFormattedBalance(newBalance) });

  return true;
}

module.exports = {
  addTransactionToAccountBalance,
  updateTransactionToAccountBalance,
};
