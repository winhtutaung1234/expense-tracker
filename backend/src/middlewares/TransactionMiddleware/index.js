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
  transactionValidation,
  validator,
];

const updateTransactionMiddleware = [
  authorization(["edit_transaction"]),
  validateId,
  transactionValidation,
  validator,
];

const deleteTransactionMiddleware = [
  authorization(["delete_transaction"]),
  validateId,
  validator,
];

module.exports = {
  readTransactionMiddleware,
  createTransactionMiddleware,
  updateTransactionMiddleware,
  deleteTransactionMiddleware,
};
