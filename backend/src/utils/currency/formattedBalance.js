const { Currency } = require("../../models");
const errResponse = require("../error/errResponse");

async function getFormattedBalance(value, currency_id = 0) {
  let decimal_places = 2;

  if (currency_id) {
    const currency = await Currency.findByPk(currency_id);

    if (!currency) {
      throw errResponse("Currency not found", 404);
    }

    decimal_places = Number(currency.decimal_places);
  }

  return Number(parseFloat(value).toFixed(decimal_places));
}

module.exports = {
  getFormattedBalance,
};
