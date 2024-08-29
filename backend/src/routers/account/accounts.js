const express = require("express");
const AccountController = require("../../controllers/Account/AccountController");
const isOwner = require("../../middlewares/AuthMiddleware/isOwner");
const router = express.Router();

router.get("/accounts", AccountController.findAll);

router.post("/accounts", AccountController.create);

router.put("/accounts/:id", AccountController.update);

router.delete("/accounts/:id", isOwner("account"), AccountController.destroy);

module.exports = {
  accountsRouter: router,
};
