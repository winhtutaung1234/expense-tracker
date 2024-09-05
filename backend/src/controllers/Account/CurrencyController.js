const asyncHandler = require("express-async-handler");
const { Currency, Account } = require("../../models");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const currencies = await Currency.findAll();
    return res.json(currencies);
  }),

  create: asyncHandler(async (req, res) => {
    const { name, code, symbol, decimal_places } = req.body;

    console.log("Request body: ", req.body);

    const currency = await Currency.create({
      name,
      code,
      symbol,
      decimal_places,
    });

    return res.status(201).json(currency);
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, code, symbol, decimal_places } = req.body;

    const currency = await Currency.findOne({ where: { id } });

    if (!currency) {
      return res.status(404).json({ msg: "Currency not found" });
    }

    await currency.update({
      name,
      code,
      symbol,
      decimal_places,
    });

    return res.status(200).json({
      msg: "Currency updated successfully",
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const currency = await Currency.findOne({ where: { id } });

    if (!currency) {
      return res.status(404).json({
        msg: "Currency not found",
      });
    }

    await currency.destroy();

    return res.sendStatus(204);
  }),
};
