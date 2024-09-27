const { body } = require("express-validator");

const validateCategoryBody = [
  body("name").notEmpty().isString().withMessage("Name must be string"),

  body("text_color")
    .notEmpty()
    .withMessage("Text color required")
    .isString()
    .withMessage("Text color must be a string"),

  body("background_color")
    .notEmpty()
    .withMessage("Background color required")
    .isString()
    .withMessage("Background color must be a string"),
];

module.exports = {
  validateCategoryBody,
};
