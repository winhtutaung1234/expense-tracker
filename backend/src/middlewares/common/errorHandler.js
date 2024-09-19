function errorHandler(err, req, res, next) {
  console.error("errorHandler: ", err);

  const response = {
    errors: [],
  };

  if (!err) {
    response.errors.push({ msg: "Unknown error occur" });
  } else if (Array.isArray(err)) {
    err.map((e) => {
      response.errors.push({ msg: e.message });
    });
  } else {
    response.errors.push({ msg: err.message });
  }

  return res.status(err.status || 500).json(response);
}

module.exports = {
  errorHandler,
};
