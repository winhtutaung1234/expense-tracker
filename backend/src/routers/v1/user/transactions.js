const express = require("express");
const TransactionController = require("../../../controllers/v1/User/TransactionController");
const {
  readTransactionMiddleware,
  createTransactionMiddleware,
  updateTransactionMiddleware,
  deleteTransactionMiddleware,
} = require("../../../middlewares/TransactionMiddleware");

const router = express.Router();

router
  .get("/", readTransactionMiddleware, TransactionController.findAll)
  .post("/", createTransactionMiddleware, TransactionController.create)
  .put("/:id", updateTransactionMiddleware, TransactionController.update)
  .delete("/:id", deleteTransactionMiddleware, TransactionController.destroy);

module.exports = { transactionsRouter: router };
