function errRespones(msg, status, path = null) {
  console.log("error from response: ", msg);
  const err = new Error(msg);
  err.status = status;
  err.path = path;
  return err;
}

module.exports = errRespones;
