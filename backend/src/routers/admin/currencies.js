const express = require("express");
const CurrencyController = require("../../controllers/Account/CurrencyController");

const {
  createCurrencyMiddleware,
  updateCurrencyMiddleware,
  deleteCurrencyMiddleware,
} = require("../../middlewares/CurrencyMiddleware");

const router = express.Router();

router.get("/", CurrencyController.findAll);

router.post("/", createCurrencyMiddleware, CurrencyController.create);

router.put("/:id", updateCurrencyMiddleware, CurrencyController.update);

router.delete("/:id", deleteCurrencyMiddleware, CurrencyController.delete);

module.exports = {
  currenciesRouter: router,
};
