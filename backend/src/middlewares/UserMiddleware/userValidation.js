const { body, param } = require("express-validator");

const createUserValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .notEmpty()
    .withMessage("Password is required"),

  body("confirmpassword")
    .isString()
    .withMessage("Confirm password must be a string")
    .isLength({ min: 6 })
    .withMessage("Confirm password must be at least 6 characters long")
    .notEmpty()
    .withMessage("Confirm password is required"),
];

const loginUserValidation = [
  body("loginInfo").notEmpty().withMessage("loginInfo is required"),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .notEmpty()
    .withMessage("Password is required"),
];

const refreshValidation = [
  body("user_id").notEmpty().isInt().withMessage("User id must be integer"),
];

module.exports = {
  createUserValidation,
  loginUserValidation,
  refreshValidation,
};
