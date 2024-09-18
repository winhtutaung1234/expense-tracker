const { Denomination } = require("../../models");

async function checkValidDeno(value, currencyId) {
  const denominations = await Denomination.findAll({
    where: { currency_id: currencyId },
  });

  if (denominations.length === 0) {
    throw new Error("No denominations found for the given currency");
  }

  const isValid = denominations.some((deno) => {
    return value % deno.value === 0;
  });

  if (isValid) {
    return true;
  } else {
    throw new Error("Invalid amount for the given currency");
  }
}

module.exports = checkValidDeno;
