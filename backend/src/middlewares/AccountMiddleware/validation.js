const { body } = require("express-validator");
const checkValidDeno = require("../../utils/account/checkValidDeno");
const { Currency } = require("../../models");
const { Denomination } = require("../../models");

const validateAccountBody = [
  body("name")
    .notEmpty()
    .isString("Account name must be a string")
    .isLength({ min: 2 })
    .withMessage("Account name must be at least 2 characters long"),

  body("currency_id")
    .notEmpty()
    .isInt()
    .withMessage("Currency id must be an integer")
    .custom(async (value) => {
      const curreny = await Currency.findByPk(value);

      if (!curreny) {
        throw new Error("Currency with that id not found");
      }

      return true;
    }),

  body("balance")
    .notEmpty()
    .custom(async (value, { req }) => {
      const result = await checkValidDeno(value, req.body.currency_id);

      if (!result) {
        throw new Error("Invalid balance for given currency");
      } else {
        return true;
      }
    }),
];

module.exports = {
  validateAccountBody,
};
