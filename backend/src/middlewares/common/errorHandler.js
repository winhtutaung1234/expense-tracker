function errorHandler(err, req, res, next) {
  console.error(err);

  const response = {
    errors: [],
  };

  if (!err) {
    response.errors.push({ msg: "Unknown error occur" });
  } else if (Array.isArray(err)) {
    err.map((e) => {
      response.errors.push({ msg: e.message, field: err.field });
    });
  } else {
    response.errors.push({ msg: err.message, field: err.field });
  }

  return res.status(err.status || 500).json(response);
}

module.exports = {
  errorHandler,
};
