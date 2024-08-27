const asyncHandler = require("express-async-handler");
const { Currency } = require("../../models");

module.exports = {
  create: asyncHandler(async (req, res) => {
    const { name, code, symbol, decimal_places } = req.body;

    const currency = await Currency.create({
      name,
      code,
      symbol,
      decimal_places,
    });

    return res.status(201).json(currency);
  }),
};
