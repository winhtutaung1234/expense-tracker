const { authorization } = require("../AuthMiddleware/authorized");
const validateId = require("../common/validateId");
const validator = require("../common/validator");

const { createUserValidation, loginUserValidation } = require("./validation");

const loginMiddleware = [loginUserValidation, validator];

const reigsterMiddleware = [createUserValidation, validator];

const deleteUserMiddleware = [
  authorization(["delete_user"]),
  validateId,
  validator,
];

const restoreUserMiddleware = [
  authorization(["restore_user"]),
  validateId,
  validator,
];

module.exports = {
  loginMiddleware,
  reigsterMiddleware,
  deleteUserMiddleware,
  restoreUserMiddleware,
};
