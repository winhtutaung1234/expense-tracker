const express = require("express");
const UserController = require("../../controllers/User/UserController");
const EmailVerifyController = require("../../controllers/User/EmailVerifyController");

const {
  createUserValidation,
  loginUserValidation,
  refreshValidation,
} = require("../../middlewares/UserMiddleware/userValidation");

const validator = require("../../middlewares/common/validator");
const validateId = require("../../middlewares/common/validateId");
const auth = require("../../middlewares/AuthMiddleware/auth");
const isAdmin = require("../../middlewares/AuthMiddleware/isAdmin");
const router = express.Router();

router.get("/verify", auth, UserController.verify);

// register -> issue access and refresh tokens and generate email verification link
router.post("/users", createUserValidation, validator, UserController.create);

// login -> issue  access and refresh tokens and generate email verification link
router.post("/login", loginUserValidation, validator, UserController.login);

// logout -> needs access token
router.post("/logout", auth, UserController.logout);

// refresh token -> issue a new access and refresh tokens -> needs access token
router.post("/refresh-token", UserController.refresh);

// soft deleted user from db -> only permission admin
router.delete(
  "/users/:id",
  auth,
  isAdmin,
  validateId,
  validator,
  UserController.destroy
);

// restore user soft deleted from db -> only permission admin
router.patch(
  "/users/:id/restore",
  auth,
  isAdmin,
  validateId,
  validator,
  UserController.restore
);

// EmailVerifyController
router.post("/email-verify", EmailVerifyController.emailVerify);

router.post("/resend-verification", EmailVerifyController.resendEmailVerify);

module.exports = {
  usersRouter: router,
};
