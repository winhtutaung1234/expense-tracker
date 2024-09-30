const { Category } = require("../../models");
const errResponse = require("../../utils/error/errResponse");

class CategoryService {
  async getAllCategories() {
    const categories = await Category.findAll({ order: [["name", "Desc"]] });
    return categories;
  }

  async createCategory(datas) {
    const { name, description, text_color, background_color } = datas;

    const category = await Category.create({
      name,
      description,
      text_color,
      background_color,
    });

    return category;
  }

  async updateCategory(id, datas) {
    const { name, description, text_color, background_color } = datas;

    const category = await Category.findByPk(id);

    if (!category) {
      throw errResponse("Category not found", 404, "category");
    }

    await category.update({ name, description, text_color, background_color });
    return true;
  }

  async deleteCategory(id) {
    const result = await Category.destroy({ where: { id } });

    if (!result) {
      throw errResponse("Category delete failed", 400, "category");
    } else {
      return true;
    }
  }
}

module.exports = new CategoryService();
