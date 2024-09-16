const { Account } = require("../models");
const errRespones = require("./error/errResponse");

async function updateAccountBalance(
  account_id,
  convertedAmount,
  transcation_type
) {
  const account = await Account.findByPk(account_id);

  if (!account) {
    throw errRespones("Account not found", 404);
  }

  let newBalance;

  if (transcation_type === "income") {
    newBalance = account.balance + convertedAmount;
  } else if (account.transcation_type === "expense") {
    if (account.balance < convertedAmount) {
      throw errRespones("Insufficient fund", 400);
    }
    newBalance = account.balance - convertedAmount;
  } else {
    throw errRespones("Invalid transcation type", 400);
  }

  account.balance = newBalance;
  await account.save();
}

module.exports = updateAccountBalance;
