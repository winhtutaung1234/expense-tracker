require("dotenv").config();

const asyncHandler = require("express-async-handler");
const { Transcation } = require("../../models");
const { Account } = require("../../models");
const { Currency } = require("../../models");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const { account_id } = req.body;

    const transcations = await Transcation.findAll({ where: { account_id } });

    return res.json(transcations);
  }),

  create: asyncHandler(async (req, res) => {
    const {
      account_id,
      category_id,
      transcation_type,
      amount,
      currency_id,
      description,
    } = req.body;

    let exchange_rate = 1;
    let converted_amount = amount;

    const account = await Account.findByPk(account_id, { include: Currency });
    const currency = await Currency.findByPk(currency_id);

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    if (account.currency_id !== currency_id) {
      const transcationCurrency = currency;
      const accountCurrency = account.currency;

      if (!transcationCurrency || !accountCurrency) {
        return res
          .status(404)
          .json({ msg: "Account or Transcation currency not found" });
      }

      const api = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${transcationCurrency.code}/${accountCurrency.code}/${amount}`;

      const res = await fetch(api);
      const data = await res.json();

      exchange_rate = data.conversion_rate;
      converted_amount = data.converison_result;
    }

    const transcation = await Transcation.create({
      account_id,
      category_id,
      transcation_type,
      amount: converted_amount,
      currency_id,
      description,
      exchange_rate,
    });

    return res.status(201).json(transcation);
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transcation = await Transcation.findByPk(id);

    if (!transcation) {
      return res.status(404).json({ msg: "Transcation not found" });
    }

    const {
      account_id,
      category_id,
      transcation_type,
      amount,
      currency_id,
      description,
    } = req.body;

    await transcation.update({
      account_id,
      category_id,
      transcation_type,
      amount,
      currency_id,
      description,
    });

    return res.json({ msg: "Transcation updated successfully" });
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transcation = await Transcation.findByPk(id);

    if (!transcation)
      return res.status(404).json({ msg: "Transcation not found" });

    await transcation.destroy();

    return res.json({ msg: "Transcation deleted successfully" });
  }),
};
