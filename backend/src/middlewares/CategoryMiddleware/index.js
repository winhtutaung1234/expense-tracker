const validator = require("../common/validator");
const validateId = require("../common/validateId");
const { validateCategoryBody } = require("./validation");

const createCategoryMiddleware = [validateCategoryBody, validator];

const updateCategoryMiddleware = [validateId, validator];

const deleteCategoryMiddleware = [validateId, validator];

module.exports = {
  createCategoryMiddleware,
  updateCategoryMiddleware,
  deleteCategoryMiddleware,
};
