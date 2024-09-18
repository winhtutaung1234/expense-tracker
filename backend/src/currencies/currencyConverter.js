require("dotenv").config();

const { Currency } = require("../models");
const { Account } = require("../models");
const errRespones = require("../utils/error/errResponse");

async function currencyConverter(account_id, currency_id, amount) {
  const account = await Account.findByPk(account_id, { include: Currency });
  const currency = await Currency.findByPk(currency_id);

  if (!account || !currency) {
    throw errRespones("Account or Currency not found", 404);
  }

  let exchange_rate = 1;
  let convertedAmount = amount;

  if (account.currency_id !== currency.id) {
    const accountCurrency = account.Currency;
    const transcationCurrency = currency;

    const api = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${transcationCurrency.code}/${accountCurrency.code}/${amount}`;

    try {
      const res = await fetch(api);
      const data = await res.json();

      exchange_rate = data.conversion_rate.toFixed(4);
      convertedAmount = data.conversion_result.toFixed(currency.decimal_places);

      return { exchange_rate, convertedAmount };
    } catch (err) {
      throw errRespones(err.message, 400);
    }
  } else {
    return { exchange_rate, convertedAmount };
  }
}

module.exports = currencyConverter;
