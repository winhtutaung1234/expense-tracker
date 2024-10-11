const { Op } = require("sequelize");
const { Account } = require("../../models");

async function isDuplicateName(type, data) {
  let accounts;

  if (type === "create") {
    accounts = await Account.findAll({ where: { user_id: data.user_id } });
  }

  if (type === "update") {
    accounts = await Account.findAll({
      where: { user_id: data.user_id, id: { [Op.ne]: data.id } },
    });
    console.log("account from duplicate: ", accounts);
  }

  const isDuplicate = accounts.some((account) => account.name === data.name);

  console.log("isDuplicate: ", isDuplicate);

  return isDuplicate;
}

module.exports = isDuplicateName;
