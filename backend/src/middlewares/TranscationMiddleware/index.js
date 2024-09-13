const { authorization } = require("../AuthMiddleware/authorized");
const { transactionValidation } = require("./validation");
const validator = require("../common/validator");
const validateId = require("../common/validateId");

const readTranscationMiddleware = [authorization(["read_transcation"])];

const createTranscationMiddleware = [
  authorization(["create_transcation"]),
  transactionValidation,
  validator,
];

const updateTranscationMiddleware = [
  authorization(["update_transcation"]),
  validateId,
  transactionValidation,
  validator,
];

const deleteTranscationMiddleware = [
  authorization(["delete_transcation"]),
  validateId,
  validator,
];

module.exports = {
  readTranscationMiddleware,
  createTranscationMiddleware,
  updateTranscationMiddleware,
  deleteTranscationMiddleware,
};
