function errorHandler(err, req, res, next) {
  console.error(err.stack);
  return res.status(err.status || 500).json({
    msg: err.message || "An unknown error occured",
  });
}

module.exports = {
  errorHandler,
};
