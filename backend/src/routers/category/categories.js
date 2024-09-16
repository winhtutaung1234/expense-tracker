const express = require("express");
const CategoryController = require("../../controllers/Category/CategoryController");
const {
  createCategoryMiddleware,
  updateCategoryMiddleware,
  deleteCategoryMiddleware,
} = require("../../middlewares/CategoryMiddleware");
const router = express.Router();

router.get("/", CategoryController.findAll);

router.post("/", createCategoryMiddleware, CategoryController.create);

router.put("/:id", updateCategoryMiddleware, CategoryController.update);

router.delete("/id", deleteCategoryMiddleware, CategoryController.destroy);

module.exports = { categoriesRouter: router };
