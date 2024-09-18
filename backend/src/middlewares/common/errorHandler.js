function errorHandler(err, req, res, next) {
  console.error("errorHandler: ", err);

  const response = {
    errors: [],
  };

  if (err.message) {
    response.errors.push({
      msg: err.message,
      path: err.path || null,
    });
  }

  return res.status(err.status || 500).json(response);
}

module.exports = {
  errorHandler,
};
