const { validationResult } = require("express-validator");

async function validator(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatErrors = errors.array().map((err) => ({
      message: err.msg,
      field: err.fields,
    }));

    next(formatErrors);
  }

  next();
}

module.exports = validator;
