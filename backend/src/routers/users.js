const express = require("express");
const UserController = require("../controllers/User/UserController");
const {
  createUserValidation,
  loginUserValidation,
  refreshValidation,
} = require("../middlewares/UserMiddleware/userValidation");
const validator = require("../middlewares/common/validator");
const validateId = require("../middlewares/common/validateId");
const auth = require("../middlewares/UserMiddleware/auth");
const EmailVerifyController = require("../controllers/User/EmailVerifyController");
const router = express.Router();

// UserController
router.get("/users", UserController.findAll);

router.get("/users/:id", validateId, validator, UserController.show);

router.get("/verify", auth, UserController.verify);

router.post("/users", createUserValidation, validator, UserController.create);

router.post(
  "/refresh-token",
  refreshValidation,
  validator,
  UserController.refresh
);

router.post("/login", loginUserValidation, validator, UserController.login);

router.post("/logout/:id", UserController.logout);

router.patch(
  "/users/:id/restore",
  validateId,
  validator,
  UserController.restore
);

router.delete("/users/:id", validateId, validator, UserController.destroy);

// EmailVerifyController
router.get("/email-verify", EmailVerifyController.emailVerify);

router.post("/resend-verification", EmailVerifyController.resendEmailVerify);

module.exports = {
  usersRouter: router,
};
