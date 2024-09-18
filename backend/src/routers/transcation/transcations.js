const express = require("express");
const TranscationController = require("../../controllers/Transcation/TranscationController");
const {
  createTranscationMiddleware,
  updateTranscationMiddleware,
  deleteTranscationMiddleware,
  readTranscationMiddleware,
} = require("../../middlewares/TranscationMiddleware");

const router = express.Router();

router
  .get("/?account_id", readTranscationMiddleware, TranscationController.findAll)
  .post("/", createTranscationMiddleware, TranscationController.create)
  .put("/:id", updateTranscationMiddleware, TranscationController.update)
  .delete("/:id", deleteTranscationMiddleware, TranscationController.destroy);

module.exports = { transcationsRouter: router };
