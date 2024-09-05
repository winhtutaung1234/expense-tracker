const express = require("express");
const CurrencyController = require("../../controllers/Account/CurrencyController");

const {
  createCurrencyMiddleware,
  updateCurrencyMiddleware,
  deleteCurrencyMiddleware,
} = require("../../middlewares/CurrencyMiddleware");

const router = express.Router();

router.get("/currencies", CurrencyController.findAll);

router.post("/currencies", createCurrencyMiddleware, CurrencyController.create);

router.put(
  "/currencies/:id",
  updateCurrencyMiddleware,
  CurrencyController.update
);

router.delete(
  "/currencies/:id",
  deleteCurrencyMiddleware,
  CurrencyController.delete
);

module.exports = {
  currenciesRouter: router,
};
