const asyncHandler = require("express-async-handler");
const { Transcation } = require("../../models");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const { account_id } = req.body;

    const transcations = await Transcation.findAll({ where: { account_id } });

    return res.json(transcations);
  }),

  create: asyncHandler(async (req, res) => {
    const {
      account_id,
      category_id,
      transcation_type,
      amount,
      currency_id,
      description,
    } = req.body;

    const transcation = await Transcation.create({
      account_id,
      category_id,
      transcation_type,
      amount,
      currency_id,
      description,
    });

    return res.status(201).json(transcation);
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transcation = await Transcation.findByPk(id);

    if (!transcation) {
      return res.status(404).json({ msg: "Transcation not found" });
    }

    const {
      account_id,
      category_id,
      transcation_type,
      amount,
      currency_id,
      description,
    } = req.body;

    await transcation.update({
      account_id,
      category_id,
      transcation_type,
      amount,
      currency_id,
      description,
    });

    return res.json({ msg: "Transcation updated successfully" });
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transcation = await Transcation.findByPk(id);

    if (!transcation)
      return res.status(404).json({ msg: "Transcation not found" });

    await transcation.destroy();

    return res.json({ msg: "Transcation deleted successfully" });
  }),
};
