function errResponse(msg, status, field = null) {
  const err = new Error(msg);
  err.status = status;
  err.field = field;
  return err;
}

module.exports = errResponse;
