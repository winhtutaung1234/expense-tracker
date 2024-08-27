const express = require("express");
const AccountController = require("../controllers/Account/AccountController");
const router = express.Router();

router.get("/accounts", AccountController.findAll);

module.exports = {
  accountsRouter: router,
};
