const { body, check } = require("express-validator");
const { Account } = require("../../models");
const checkValidDeno = require("../../utils/account/checkValidDeno");

const validateAccountBody = [
  body("name")
    .notEmpty()
    .isString("Account name must be a string")
    .isLength({ min: 2 })
    .withMessage("Account name must be at least 2 characters long"),

  body("currency_id")
    .notEmpty()
    .isInt()
    .withMessage("Currency id must be an integer"),

  body("balance")
    .notEmpty()
    .custom(async (value, { req }) => {
      try {
        await checkValidDeno(value, req.body.currency_id);
        return true;
      } catch (err) {
        throw new Error(err.message);
      }
    }),
];

module.exports = {
  validateAccountBody,
};
