function errorHandler(err, req, res, next) {
  console.log(err.stack);

  const response = {
    errors: [],
  };

  if (!err) {
    response.errors.push({ msg: "Unknown error occur" });
  } else {
    response.errors.push({ msg: err.message, field: err.field });
  }

  return res.status(err.status || 500).json(response);
}
module.exports = {
  errorHandler,
};
