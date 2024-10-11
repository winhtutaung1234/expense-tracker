const { Account, Transaction, TransactionConversion } = require("../../models");
const { getFormattedBalance } = require("../currency/formattedBalance");

async function updateAccountBalance(accountId, accountBalance) {
  await Account.update(
    { balance: accountBalance },
    { where: { id: accountId } }
  );
}

module.exports = {
  updateAccountBalance,
};
