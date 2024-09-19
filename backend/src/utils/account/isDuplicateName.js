const { Op } = require("sequelize");
const { Account } = require("../../models");
const errRespones = require("../error/errResponse");

async function isDuplicateName(type, data) {
  let accounts;

  if (type === "create") {
    accounts = await Account.findAll({ where: { user_id: data.user_id } });
  }

  if (type === "update") {
    accounts = await Account.findAll({
      where: { user_id: data.user_id, id: { [Op.ne]: data.accountId } },
    });
  }

  const isDuplicate = accounts.some((account) => account.name === data.name);

  if (isDuplicate) {
    throw errRespones("Account name cannot be duplicate", 400, "name");
  }
}

module.exports = isDuplicateName;
