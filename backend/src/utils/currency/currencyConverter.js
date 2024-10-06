require("dotenv").config();

const { Currency } = require("../../models");
const { Account } = require("../../models");
const { Denomination } = require("../../models");
const errResponse = require("../error/errResponse");

// get exchange_rate and converted amount -> accountCurrency / account.Currency.code , accountCurrency
async function getExchangeRateAndConvertedAmount({
  accountCurrencyCode,
  accountCurrencyDecimalPlaces,
  transactionCurrencyCode,
  amount,
}) {
  const api = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${transactionCurrencyCode}/${accountCurrencyCode}/${amount}`;

  const res = await fetch(api);
  const data = await res.json();

  const exchange_rate = data.conversion_rate.toFixed(5);
  const convertedAmount = data.conversion_result.toFixed(
    accountCurrencyDecimalPlaces
  );

  return { exchange_rate, convertedAmount };
}

// get invalid amount for non decimal currency -> Exp. Myanmar
async function getInvalidCurrencyAmountForNonDecimal(
  accountCurrencyId,
  convertedAmount
) {
  const denominations = await Denomination.findAll({
    where: { currency_id: accountCurrencyId },
    order: [["value", "DESC"]],
  });

  if (!denominations) {
    throw errResponse("Denominations not found", 404);
  }

  let invalidCurrencyAmount = convertedAmount;

  denominations.forEach(
    (deno) =>
      (invalidCurrencyAmount = invalidCurrencyAmount % Number(deno.value))
  );

  return invalidCurrencyAmount;
}

async function currencyConverter({
  accountCurrency, // account.Currency
  transactionCurrency, // currencys
  amount,
}) {
  let convertedCurrencyId = accountCurrency.id;

  const { exchange_rate, convertedAmount } =
    await getExchangeRateAndConvertedAmount({
      accountCurrencyCode: accountCurrency.code,
      accountCurrencyDecimalPlaces: accountCurrency.decimal_places,
      transactionCurrencyCode: transactionCurrency.code,
      amount,
    });

  if (!accountCurrency.decimal_places) {
    const invalidCurrencyAmount = await getInvalidCurrencyAmountForNonDecimal(
      accountCurrency.id,
      convertedAmount
    );

    console.log("invalid currency amount: ", invalidCurrencyAmount);

    return {
      exchange_rate,
      convertedAmount: convertedAmount - invalidCurrencyAmount,
      convertedCurrencyId,
    };
  }
  return {
    exchange_rate,
    convertedAmount,
    convertedCurrencyId,
  };
}

module.exports = currencyConverter;
