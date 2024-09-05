const express = require("express");
const AccountController = require("../../controllers/Account/AccountController");
const isOwner = require("../../middlewares/AuthMiddleware/isOwner");

const {
  createAccountMiddleware,
  updateAccountMiddleware,
  deleteAccountMiddleware,
  readMiddleware,
} = require("../../middlewares/AccountMiddleware");

const router = express.Router();

router.get("/accounts", readMiddleware, AccountController.findAll);

router.get("/accounts/:id", isOwner("account"), AccountController.show);

router.post("/accounts", createAccountMiddleware, AccountController.create);

router.put(
  "/accounts/:id",
  updateAccountMiddleware,
  isOwner("account"), // only owner can update
  AccountController.update
);

router.delete(
  "/accounts/:id",
  deleteAccountMiddleware,
  isOwner("account"), // only owner can delete
  AccountController.destroy
);

module.exports = {
  accountsRouter: router,
};
