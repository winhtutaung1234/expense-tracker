// src/validation/transactionValidation.js

const { body } = require("express-validator");

const transactionValidation = [
  body("account_id")
    .isInt({ min: 1 })
    .withMessage("Account ID must be a positive integer"),

  body("category_id")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),

  body("transcation_type")
    .isIn(["income", "expense", "transfer"])
    .withMessage(
      'Transaction type must be one of "income", "expense", or "transfer"'
    ),

  body("amount")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage(
      "Amount must be a valid decimal value with up to 2 decimal places"
    ),

  body("currency_id")
    .isInt({ min: 1 })
    .withMessage("Currency ID must be a positive integer"),

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

module.exports = { transactionValidation };
