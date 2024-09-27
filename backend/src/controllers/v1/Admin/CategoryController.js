const asyncHandler = require("express-async-handler");
const { Category } = require("../../../models");
const CategoryService = require("../../../services/v1/CategoryService");
const errResponse = require("../../../utils/error/errResponse");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const categories = await CategoryService.getAllCategories();

    return res.json(categories);
  }),

  create: asyncHandler(async (req, res) => {
    const category = await CategoryService.createCategory(req.body);
    return res.status(201).json(category);
  }),

  update: asyncHandler(async (req, res) => {
    const result = await CategoryService.updateCategory(
      req.params.id,
      req.body
    );

    if (!result) {
      throw errResponse("Update failed", 400, "category");
    } else {
      return res.json({ msg: "Updated Successfully" });
    }
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;

    await CategoryService.deleteCategory(id);
    return res.json({ msg: "Deleted successfully" });
  }),
};
