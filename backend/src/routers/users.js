const express = require("express");
const UserController = require("../controllers/User/UserController");
const {
  createUserValidation,
  loginUserValidation,
  refreshValidation,
} = require("../middlewares/UserMiddleware/userValidation");
const validator = require("../middlewares/common/validator");
const validateId = require("../middlewares/common/validateId");
const auth = require("../middlewares/AuthMiddleware/auth");
const EmailVerifyController = require("../controllers/User/EmailVerifyController");
const router = express.Router();

router.get("/verify", auth, UserController.verify);

// register -> access and refresh tokens
router.post("/users", createUserValidation, validator, UserController.create);

// login -> access and refresh tokens
router.post("/login", loginUserValidation, validator, UserController.login);

// logout
router.post("/logout/:id", UserController.logout);

router.post(
  "/refresh-token",
  refreshValidation,
  validator,
  UserController.refresh
);

router.patch(
  "/users/:id/restore",
  validateId,
  validator,
  UserController.restore
);

// EmailVerifyController
router.get("/email-verify", EmailVerifyController.emailVerify);

router.post("/resend-verification", EmailVerifyController.resendEmailVerify);

module.exports = {
  usersRouter: router,
};
