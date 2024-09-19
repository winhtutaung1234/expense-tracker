const express = require("express");
const { usersRouter } = require("./user/users");
const { currenciesRouter } = require("./admin/currencies");
const { categoriesRouter } = require("./admin/categories");
const { accountsRouter } = require("./user/accounts");
const { transactionsRouter } = require("./user/transactions");
const auth = require("../../middlewares/AuthMiddleware/auth");
const router = express.Router();

router.use("/", usersRouter);

router.use(auth);

router.use("/categories", categoriesRouter);
router.use("/currencies", currenciesRouter);
router.use("/accounts", accountsRouter);
router.use("/transactions", transactionsRouter);

module.exports = { apiV1Routers: router };
