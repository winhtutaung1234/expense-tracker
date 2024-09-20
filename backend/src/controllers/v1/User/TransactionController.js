require("dotenv").config();

const asyncHandler = require("express-async-handler");
const TransactionService = require("../../../services/v1/TransactionService");
const TransactionResource = require("../../../resources/TransactionResource");
const errResponse = require("../../../utils/error/errResponse");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const { account_id } = req.query;

    const transactions = await TransactionService.getAllTransactions(
      account_id
    );

    return res.json(TransactionResource.collection(transactions));
  }),

  create: asyncHandler(async (req, res) => {
    const { account_id } = req.body;

    const transaction = await TransactionService.createTransaction(
      account_id,
      req.body
    );

    return res.status(201).json(new TransactionResource(transaction).exec());
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { account_id } = req.body;

    const transaction = await TransactionService.updateTransaction(
      id,
      req.body,
      account_id
    );

    return res.json(new TransactionResource(transaction).exec());
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { account_id } = req.body;

    await TransactionService.deleteTransaction(id, account_id);
    return res.sendStatus(204);
  }),
};
