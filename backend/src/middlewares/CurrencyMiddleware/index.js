const { authorization } = require("../AuthMiddleware/authorized");
const { validateCreateCurrency } = require("./currencyValidation");

const validator = require("../../middlewares/common/validator");
const validateId = require("../common/validateId");

const createCurrencyMiddleware = [
  authorization(["create_currency"]),
  validateCreateCurrency,
  validator,
];

const updateCurrencyMiddleware = [
  authorization(["update_currency"]),
  validateId,
  validateCreateCurrency,
  validator,
];

const deleteCurrencyMiddleware = [
  authorization(["delete_currency"]),
  validateId,
  validator,
];

module.exports = {
  createCurrencyMiddleware,
  updateCurrencyMiddleware,
  deleteCurrencyMiddleware,
};
