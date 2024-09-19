const express = require("express");

const EmailVerifyController = require("../../../controllers/v1/User/EmailVerifyController");
const UserController = require("../../../controllers/v1/User/UserController");

const {
  restoreUserMiddleware,
  deleteUserMiddleware,
  loginMiddleware,
  reigsterMiddleware,
} = require("../../../middlewares/UserMiddleware");
const auth = require("../../../middlewares/AuthMiddleware/auth");
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
