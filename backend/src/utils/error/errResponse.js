function errRespones(msg, status) {
  console.log("msg: ", msg);
  const err = new Error(msg);
  err.status = status;
  return err;
}

module.exports = errRespones;
