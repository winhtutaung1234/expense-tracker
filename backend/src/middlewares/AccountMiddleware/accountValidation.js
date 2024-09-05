const { body } = require("express-validator");

const validateAccountBody = [
  body("name")
    .notEmpty()
    .isString("Account name must be a string")
    .isLength({ min: 2 })
    .withMessage("Account name must be at least 2 characters long"),

  body("balance").notEmpty().isDecimal().withMessage("Balance must be decimal"),

  body("currency_id")
    .notEmpty()
    .isInt()
    .withMessage("Currency id must be an integer"),
];

module.exports = {
  validateAccountBody,
};
