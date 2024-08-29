const express = require("express");
const CurrencyController = require("../../controllers/Account/CurrencyController");

const validator = require("../../middlewares/common/validator");
const {
  validateCreateCurrency,
} = require("../../middlewares/CurrencyMiddleware/currencyValidation");
const router = express.Router();

router.get("/currencies", CurrencyController.findAll);

router.post(
  "/currencies",
  validateCreateCurrency,
  validator,
  CurrencyController.create
);

router.put("/currencies/:id", CurrencyController.update);

router.delete("/currencies/:id", CurrencyController.delete);

module.exports = {
  currenciesRouter: router,
};
