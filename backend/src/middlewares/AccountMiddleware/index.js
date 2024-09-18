const { authorization } = require("../AuthMiddleware/authorized");
const validateId = require("../common/validateId");
const validator = require("../common/validator");
const accountLimits = require("./accountLimits");
const { validateAccountBody } = require("./validation");

const readMiddleware = [authorization(["read_account"])];

const createAccountMiddleware = [
  authorization(["create_account"]),
  accountLimits,
  validateAccountBody,
  validator,
];

const updateAccountMiddleware = [
  authorization(["update_account"]),
  validateId,
  validateAccountBody,
  validator,
];

const deleteAccountMiddleware = [
  authorization(["delete_account"]),
  validateId,
  validator,
];

module.exports = {
  readMiddleware,
  createAccountMiddleware,
  updateAccountMiddleware,
  deleteAccountMiddleware,
};
