const express = require("express");

const {
  createCurrencyMiddleware,
  updateCurrencyMiddleware,
  deleteCurrencyMiddleware,
} = require("../../../middlewares/CurrencyMiddleware");

const CurrencyController = require("../../../controllers/v1/Admin/CurrencyController");
const upload = require("../../../utils/upload/fileUpload");

const router = express.Router();

router.get("/", CurrencyController.findAll);

router.post(
  "/",
  upload.single("currency_image"),
  createCurrencyMiddleware,
  CurrencyController.create
);

router.put(
  "/:id",
  upload.single("currency_image"),
  updateCurrencyMiddleware,
  CurrencyController.update
);

router.delete("/:id", deleteCurrencyMiddleware, CurrencyController.delete);

module.exports = {
  currenciesRouter: router,
};
