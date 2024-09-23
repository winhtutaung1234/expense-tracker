require("dotenv").config();

const { Currency } = require("../../models");
const { Account } = require("../../models");
const { Denomination } = require("../../models");
const errResponse = require("../error/errResponse");

async function currencyConverter(account_id, currency_id, amount) {
  const account = await Account.findByPk(
    account_id,
    { include: Currency },
    { attributes: ["code", "decimal_places"] }
  );

  if (!account) {
    throw errResponse("Account not found", 404);
  }

  const currency = await Currency.findByPk(currency_id);
  if (!currency) {
    throw errResponse("Currency not found", 404);
  }

  let convertedAmount = amount;
  let exchange_rate = 1;

  if (Number(account.currency_id) !== Number(currency_id)) {
    const accountCurrency = account.Currency.code;
    const transactionCurrency = currency.code;

    try {
      const api = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${transactionCurrency}/${accountCurrency}/${amount}`;

      const res = await fetch(api);
      const data = await res.json();

      exchange_rate = data.conversion_rate.toFixed(4);
      convertedAmount = data.conversion_result.toFixed(
        account.Currency.decimal_places
      );

      if (!account.Currency.decimal_places) {
        const denominations = await Denomination.findAll({
          where: { currency_id: account.Currency.id },
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

        convertedAmount -= invalidCurrencyAmount;
      }
    } catch (err) {
      throw errResponse(err.message, 400);
    }
  }

  console.log("converted Amount: ", convertedAmount);

  return { exchange_rate, convertedAmount };
}

module.exports = currencyConverter;
