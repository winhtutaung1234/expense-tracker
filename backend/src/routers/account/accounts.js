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

router.get("/", readMiddleware, AccountController.findAll);

router.get("/:id", isOwner("account"), AccountController.show);

router.post("/", createAccountMiddleware, AccountController.create);

router.put(
  "/:id",
  updateAccountMiddleware,
  isOwner("account"), // only owner can update
  AccountController.update
);

router.delete(
  "/:id",
  deleteAccountMiddleware,
  isOwner("account"), // only owner can delete
  AccountController.destroy
);

module.exports = {
  accountsRouter: router,
};
