const { body } = require("express-validator");
const { Account } = require("../../models");

const validateAccountBody = [
  body("name")
    .notEmpty()
    .isString("Account name must be a string")
    .isLength({ min: 2 })
    .withMessage("Account name must be at least 2 characters long")
    .custom(async (value) => {
      const account = await Account.findOne({ where: { name: value } });

      if (account) {
        throw new Error("Account name cannot be duplicate");
      }

      return true;
    }),

  body("currency_id")
    .notEmpty()
    .isInt()
    .withMessage("Currency id must be an integer"),

  body("balance")
    .notEmpty()
    .isDecimal()
    .withMessage("Balance must be decimal")
    .custom(async (value, { req }) => {}),
];

module.exports = {
  validateAccountBody,
};
