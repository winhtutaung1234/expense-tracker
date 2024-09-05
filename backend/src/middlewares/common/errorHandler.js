function errorHandler(err, req, res, next) {
  console.error(err);
  return res.status(err.status || 500).json({
    msg: err.message || "An unknown error occured",
  });
}

module.exports = {
  errorHandler,
};
