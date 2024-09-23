// src/validation/transactionValidation.js
const { Denomination } = require("../../models");

const { body, query } = require("express-validator");
const checkValidDeno = require("../../utils/account/checkValidDeno");

const transactionQueryValidation = [
  query("account_id")
    .notEmpty()
    .withMessage("Account Id cannot be empty")
    .isInt({ min: 1 })
    .withMessage("Account Id must be a positive integer"),
];

const transactionValidation = [
  body("account_id")
    .notEmpty()
    .withMessage("Account Id cannot be empty")
    .isInt({ min: 1 })
    .withMessage("Account Id must be a positive integer"),

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

  body("amount")
    .notEmpty()
    .withMessage("Amount cannot be empty")
    .custom(async (value, { req }) => {
      const result = await checkValidDeno(value, req.body.currency_id);

      if (!result) {
        throw new Error("Invalid amount for given currency");
      } else {
        return true;
      }
    }),

  body("description").optional().isString(),

  body("exchange_rate")
    .optional()
    .isDecimal()
    .withMessage("Exchange rate must be a valid decimal number"),
];

module.exports = { transactionValidation, transactionQueryValidation };
