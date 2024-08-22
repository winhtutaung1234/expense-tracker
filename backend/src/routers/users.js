const express = require("express");
const UserController = require("../controllers/User/UserController");
const {
  createUserValidation,
  loginUserValidation,
} = require("../middlewares/UserMiddleware/userValidation");
const validator = require("../middlewares/common/validator");
const validateId = require("../middlewares/common/validateId");
const auth = require("../middlewares/UserMiddleware/auth");
const router = express.Router();

router.get("/users", UserController.findAll);

router.get("/users/:id", validateId, validator, UserController.show);

router.get("/verify", auth, UserController.verify);

router.get("/email-verify", UserController.emailVerify);

router.post("/users", createUserValidation, validator, UserController.create);

router.post("/refresh-token", UserController.refresh);

router.post("/login", loginUserValidation, validator, UserController.login);

router.patch("/forgot-password", UserController.forgotPassword);

router.patch(
  "/users/:id/restore",
  validateId,
  validator,
  UserController.restore
);

router.delete("/users/:id", validateId, validator, UserController.destroy);

module.exports = {
  usersRouter: router,
};
