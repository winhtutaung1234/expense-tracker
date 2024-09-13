const asyncHandler = require("express-async-handler");
const { Category } = require("../../models");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const categories = await Category.findAll();

    return res.json(categories);
  }),

  create: asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const category = await Category.create({ name, description });
    return res.status(201).json(category);
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);

    if (!category) return res.status(404).json({ msg: "Category not found" });

    await category.update({ name, description });

    return res.json({ msg: "Updated Successfully" });
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) return res.status(404).json({ msg: "Category not found" });

    await category.destroy();
    return res.json({ msg: "Deleted successfully" });
  }),
};
