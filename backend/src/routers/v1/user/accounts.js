const express = require("express");
const AccountController = require("../../../controllers/v1/User/AccountController");
const isOwner = require("../../../middlewares/AuthMiddleware/isOwner");

const {
  createAccountMiddleware,
  updateAccountMiddleware,
  deleteAccountMiddleware,
  readMiddleware,
} = require("../../../middlewares/AccountMiddleware");

const router = express.Router();

router
  .get("/", readMiddleware, AccountController.findAll)
  .get("/:id", readMiddleware, isOwner("account"), AccountController.show) // only owner can view the account
  .post("/", createAccountMiddleware, AccountController.create)
  .put(
    "/:id",
    updateAccountMiddleware,
    isOwner("account"), // only owner can update
    AccountController.update
  )
  .delete(
    "/:id",
    deleteAccountMiddleware,
    isOwner("account"), // only owner can delete
    AccountController.destroy
  );

module.exports = {
  accountsRouter: router,
};
