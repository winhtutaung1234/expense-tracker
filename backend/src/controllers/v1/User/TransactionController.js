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

  show: asyncHandler(async (req, res) => {
    const { id } = req.query;
    const transaction = await TransactionService.getTransaction(id);
    return res.json(new TransactionResource(transaction).exec());
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
    const { user } = req;

    const transaction = await TransactionService.updateTransaction(
      id,
      req.body,
      user.id
    );

    return res.json(new TransactionResource(transaction).exec());
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    console.log("destory transaction: ", user.id);

    await TransactionService.deleteTransaction(id, user.id);
    return res.sendStatus(204);
  }),
};
