const { validationResult } = require("express-validator");

async function validator(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.mapped(),
    });
  }

  next();
}

module.exports = validator;
