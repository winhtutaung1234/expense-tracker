const { body } = require("express-validator");

const validateCreateCurrency = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isString()
    .withMessage("Code must be a string")
    .isLength({ min: 3, max: 3 })
    .withMessage("Code must be exactly 3 characters long"),

  body("symbol")
    .notEmpty()
    .withMessage("Symbol is required")
    .isString()
    .withMessage("Symbol must be a string")
    .isLength({ min: 1 })
    .withMessage("Symbol must be at least 1 character long"),

  body("decimal_places")
    .notEmpty()
    .withMessage("Decimal places are required")
    .isInt({ min: 0 })
    .withMessage("Decimal places must be a non-negative integer"),
];

module.exports = {
  validateCreateCurrency,
};
