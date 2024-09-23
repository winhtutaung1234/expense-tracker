const { validationResult } = require("express-validator");

async function validator(req, res, next) {
  const errors = validationResult(req);

  console.log("errors from validator: ", errors);

  if (!errors.isEmpty()) {
    const formatErrors = errors.array().map((err) => ({
      message: err.msg,
      field: err.path,
    }));

    next(formatErrors);
  }

  next();
}

module.exports = validator;
