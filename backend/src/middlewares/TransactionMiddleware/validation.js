// src/validation/transactionValidation.js
const { Denomination } = require("../../models");

const { body, query } = require("express-validator");

const transactionQueryValidation = [
  query("account_id")
    .notEmpty()
    .withMessage("Account Id cannot be empty")
    .isInt({ min: 1 })
    .withMessage("Account Id must be a positive integer"),
];

const transactionValidation = [
  body("category_id")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),

  body("transaction_type")
    .isIn(["income", "expense", "transfer"])
    .withMessage(
      'Transaction type must be one of "income", "expense", or "transfer"'
    ),

  body("currency_id")
    .isInt({ min: 1 })
    .withMessage("Currency ID must be a positive integer"),

  body("amount").custom(async (value, { req }) => {
    const denominations = await Denomination.findAll({
      where: { currency_id: req.body.currency_id },
    });

    if (denominations.length === 0) {
      throw new Error("No denominations found for the given currency");
    }

    const isValid = denominations.some((deno) => {
      return value % deno.value === 0;
    });

    if (!isValid) {
      throw new Error("Invalid amount for the given currency denominations");
    }

    return true;
  }),

  body("description")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage(
      "Description should be a text field with a maximum length of 500 characters"
    ),

  body("exchange_rate")
    .optional()
    .isDecimal()
    .withMessage("Exchange rate must be a valid decimal number"),
];

module.exports = { transactionValidation, transactionQueryValidation };
