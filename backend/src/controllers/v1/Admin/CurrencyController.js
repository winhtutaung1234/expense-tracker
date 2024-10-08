require("dotenv").config();

const asyncHandler = require("express-async-handler");
const CurrencyService = require("../../../services/v1/CurrencyService");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const currencies = await CurrencyService.getAllCurrencies();
    return res.json(currencies);
  }),

  create: asyncHandler(async (req, res) => {
    const { name, code, symbol, decimal_places } = req.body;
    const { filename } = req.file;

    const currency = await CurrencyService.createCurrency({
      name,
      code,
      symbol,
      decimal_places,
      image: filename,
    });

    return res.status(201).json(currency);
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, code, symbol, decimal_places } = req.body;
    const image = req.file?.filename;

    const currency = await CurrencyService.updateCurrency(id, {
      name,
      code,
      symbol,
      decimal_places,
      image,
    });

    if (currency) {
      return res.json(currency);
    } else {
      return res.status(400).json({ msg: "Failed to update currency" });
    }
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await CurrencyService.deleteCurrency(id);

    if (result) {
      return res.json({ msg: "Currency deleted successfully" });
    } else {
      return res.status(400).json({ msg: "Failed to delete currency" });
    }
  }),
};
