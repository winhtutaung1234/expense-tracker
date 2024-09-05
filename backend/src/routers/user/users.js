const express = require("express");
const UserController = require("../../controllers/User/UserController");
const EmailVerifyController = require("../../controllers/User/EmailVerifyController");

const {
  createUserValidation,
  loginUserValidation,
} = require("../../middlewares/UserMiddleware/userValidation");

const validator = require("../../middlewares/common/validator");
const validateId = require("../../middlewares/common/validateId");
const auth = require("../../middlewares/AuthMiddleware/auth");
const isAdmin = require("../../middlewares/AuthMiddleware/isAdmin");
const {
  restoreUserMiddleware,
  deleteUserMiddleware,
  loginMiddleware,
  reigsterMiddleware,
} = require("../../middlewares/UserMiddleware");
const router = express.Router();

router.get("/users", UserController.findAll);

router.get("/verify", auth, UserController.verify);

// register -> issue access and refresh tokens and generate email verification link
router.post("/users", reigsterMiddleware, UserController.create);

// login -> issue  access and refresh tokens and generate email verification link
router.post("/login", loginMiddleware, UserController.login);

// logout -> needs access token
router.post("/logout", auth, UserController.logout);

// refresh token -> issue a new access and refresh tokens -> needs access token
router.post("/refresh-token", UserController.refresh);

// soft deleted user from db -> only permission admin
router.delete("/users/:id", auth, deleteUserMiddleware, UserController.destroy);

// restore user soft deleted from db -> only permission admin
router.patch(
  "/users/:id/restore",
  auth,
  restoreUserMiddleware,
  UserController.restore
);

// EmailVerifyController
router.post("/email-verify", EmailVerifyController.emailVerify);

router.post("/resend-verification", EmailVerifyController.resendEmailVerify);

module.exports = {
  usersRouter: router,
};
