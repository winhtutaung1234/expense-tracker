const { Denomination } = require("../../models");
const errResponse = require("../error/errResponse");

async function checkValidDeno(value, currency_id) {
  const denominations = await Denomination.findAll({ where: { currency_id } });

  if (!denominations) {
    throw errResponse("Denominations not found", 404);
  }

  const isValid = denominations.some((deno) => {
    return value % deno.value === 0;
  });

  if (isValid) {
    return true;
  } else {
    return false;
  }
}

module.exports = checkValidDeno;
