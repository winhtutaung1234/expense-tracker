const express = require("express");
const TransactionController = require("../../../controllers/v1/User/TransactionController");
const {
  readTransactionMiddleware,
  createTransactionMiddleware,
  updateTransactionMiddleware,
  deleteTransactionMiddleware,
} = require("../../../middlewares/TransactionMiddleware");
const isOwner = require("../../../middlewares/AuthMiddleware/isOwner");

const router = express.Router();

router
  .get("/", readTransactionMiddleware, TransactionController.findAll)
  .get("/:id", TransactionController.show)
  .post("/", createTransactionMiddleware, TransactionController.create)
  .put("/:id", updateTransactionMiddleware, TransactionController.update)
  .delete(
    "/:id",
    isOwner("transaction"),
    deleteTransactionMiddleware,
    TransactionController.destroy
  );

module.exports = { transactionsRouter: router };
