const express = require("express");

const {
  createCurrencyMiddleware,
  updateCurrencyMiddleware,
  deleteCurrencyMiddleware,
} = require("../../../middlewares/CurrencyMiddleware");

const CurrencyController = require("../../../controllers/v1/Admin/CurrencyController");

const router = express.Router();

router.get("/", CurrencyController.findAll);

router.post("/", createCurrencyMiddleware, CurrencyController.create);

router.put("/:id", updateCurrencyMiddleware, CurrencyController.update);

router.delete("/:id", deleteCurrencyMiddleware, CurrencyController.delete);

module.exports = {
  currenciesRouter: router,
};
