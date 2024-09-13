const { body } = require("express-validator");

const validateCategoryBody = [
  body("name").notEmpty().isString().withMessage("Name must be string"),
];

module.exports = {
  validateCategoryBody,
};
