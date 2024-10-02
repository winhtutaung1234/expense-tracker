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

// async function currencyConverter(account_id, currency_id, amount) {
//   const account = await Account.findByPk(
//     account_id,
//     { include: Currency },
//     { attributes: ["code", "decimal_places", "currency_id"] }
//   );

//   const currency = await Currency.findByPk(currency_id);
//   if (!currency) {
//     throw errResponse("Currency not found", 404);
//   }

//   let convertedAmount = amount;
//   let exchange_rate = 1;
//   let convertedCurrencyId = null;

//   if (Number(account.currency_id) !== Number(currency_id)) {
//     const accountCurrency = account.Currency.code;
//     const transactionCurrency = currency.code;

//     targetedCurrencyId = account.currency_id;

//     try {
//       const api = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${transactionCurrency}/${accountCurrency}/${amount}`;

//       if (!account.Currency.decimal_places) {
//         const denominations = await Denomination.findAll({
//           where: { currency_id: account.Currency.id },
//           order: [["value", "DESC"]],
//         });

//         if (!denominations) {
//           throw errResponse("Denominations not found", 404);
//         }

//         let invalidCurrencyAmount = convertedAmount;

//         denominations.forEach(
//           (deno) =>
//             (invalidCurrencyAmount = invalidCurrencyAmount % Number(deno.value))
//         );

//         convertedAmount -= invalidCurrencyAmount;
//       }
//     } catch (err) {
//       throw errResponse(err.message, 400);
//     }
//   }

//   return {
//     exchange_rate,
//     convertedAmount,
//     targetedCurrencyId,
//   };
// }

module.exports = currencyConverter;
