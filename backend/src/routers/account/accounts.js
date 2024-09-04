const express = require("express");
const AccountController = require("../../controllers/Account/AccountController");
const isOwner = require("../../middlewares/AuthMiddleware/isOwner");

const {
  validateAccountBody,
} = require("../../middlewares/AccountMiddleware/accountValidation");

const validator = require("../../middlewares/common/validator");
const validateId = require("../../middlewares/common/validateId");

const router = express.Router();

router.get("/accounts", AccountController.findAll);

router.post(
  "/accounts",
  validateAccountBody,
  validator,
  AccountController.create
);

router.put("/accounts/:id", validateId, validator, AccountController.update);

router.delete(
  "/accounts/:id",
  isOwner("account"),
  validateId,
  validator,
  AccountController.destroy
);

module.exports = {
  accountsRouter: router,
};
