const { Denomination, Sequelize } = require("../../models");

async function checkNonDecimalBalance(balance, currency_id) {
  const denominations = await Denomination.findAll({
    where: { currency_id },
    attributes: ["value"],
    order: [["value", "Desc"]],
    raw: true,
  });

  let remainingBalance = parseInt(balance);

  const values = denominations.map((deno) => parseInt(deno.value));

  for (let deno of values) {
    remainingBalance = remainingBalance % deno;
  }

  return remainingBalance === 0;
}

async function checkDecimalBalance(balance, currency_id) {
  const decimalDeno = await Denomination.findAll({
    where: {
      currency_id,
      value: {
        [Sequelize.Op.lt]: 1,
      },
    },
    attributes: ["value"],
    order: [["value", "Desc"]],
    raw: true,
  });

  const nonDecimalDeno = await Denomination.findAll({
    where: {
      currency_id,
      value: {
        [Sequelize.Op.gte]: 1,
      },
    },
    attributes: ["value"],
    order: [["value", "Desc"]],
    raw: true,
  });

  const stringBalance = balance.toString();
  const [nonDecimal, decimal] = stringBalance.split(".");

  let nonDecimalBalance = parseInt(nonDecimal);
  for (let nonDeno of nonDecimalDeno) {
    nonDecimalBalance = nonDecimalBalance % parseInt(nonDeno.value);
  }

  let decimalBalance = parseFloat(`0.${decimal}`);
  for (let deciDeno of decimalDeno) {
    decimalBalance = decimalBalance % parseFloat(deciDeno.value);
  }

  return nonDecimalBalance === 0 && decimalBalance === 0;
}

module.exports = {
  checkNonDecimalBalance,
  checkDecimalBalance,
};
