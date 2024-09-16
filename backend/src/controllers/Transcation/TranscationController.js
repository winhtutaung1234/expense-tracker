require("dotenv").config();

const asyncHandler = require("express-async-handler");
const { Transcation } = require("../../models");
const { Account } = require("../../models");
const { Currency } = require("../../models");
const { Denomination } = require("../../models");
const currencyConverter = require("../../currencies/currencyConverter");
const updateAccountBalance = require("../../utils/updateAccountBalance");

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

    // convert appropiate currency based on account's currecny
    const { exchange_rate, convertedAmount } = await currencyConverter(
      account_id,
      currency_id,
      amount
    );

    await updateAccountBalance(account_id, convertedAmount, transcation_type);

    // Create the transaction with the converted amount and exchange rate
    const transcation = await Transcation.create({
      account_id,
      category_id,
      transcation_type,
      amount: convertedAmount,
      currency_id,
      description,
      exchange_rate: exchange_rate,
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
