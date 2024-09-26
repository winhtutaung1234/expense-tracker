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

router
  .get("/verify", auth, UserController.verify)
  .get("/users", UserController.findAll)
  .get("/users/:id", UserController.show)
  .post("/login", loginMiddleware, UserController.login)
  .post("/refresh-token", UserController.refresh)
  .post("/register", reigsterMiddleware, UserController.register);

// logout -> needs access token
router.post("/logout", auth, UserController.logout);

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
