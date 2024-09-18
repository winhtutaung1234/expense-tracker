const { Account } = require("../../models");
const errRespones = require("../error/errResponse");

async function isDuplicateName(name, userId) {
  const accounts = await Account.findAll({ where: { user_id: userId } });

  if (!accounts) {
    throw errRespones("Accounts not found", 404);
  }

  const isDuplicate = accounts.some((account) => account.name === name);

  if (isDuplicate) {
    throw errRespones("Account name cannot be duplicate", 400);
  }

  return true;
}

module.exports = isDuplicateName;
