const { authorization } = require("../AuthMiddleware/authorized");
const {
  transactionValidation,
  transactionQueryValidation,
} = require("./validation");
const validator = require("../common/validator");
const validateId = require("../common/validateId");

const readTransactionMiddleware = [
  authorization(["read_transaction"]),
  transactionQueryValidation,
  validator,
];

const createTransactionMiddleware = [
  authorization(["create_transaction"]),
  transactionQueryValidation,
  transactionValidation,
  validator,
];

const updateTransactionMiddleware = [
  authorization(["update_transaction"]),
  validateId,
  transactionQueryValidation,
  transactionValidation,
  validator,
];

const deleteTransactionMiddleware = [
  authorization(["delete_transaction"]),
  transactionQueryValidation,
  validateId,
  validator,
];

module.exports = {
  readTransactionMiddleware,
  createTransactionMiddleware,
  updateTransactionMiddleware,
  deleteTransactionMiddleware,
};
