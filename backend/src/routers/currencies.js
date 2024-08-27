const express = require("express");
const CurrencyController = require("../controllers/Account/CurrencyController");
const {
  createUserValidation,
} = require("../middlewares/UserMiddleware/userValidation");
const validator = require("../middlewares/common/validator");
const router = express.Router();

router.post(
  "/currencies",
  createUserValidation,
  validator,
  CurrencyController.create
);

module.exports = {
  currenciesRouter: router,
};
