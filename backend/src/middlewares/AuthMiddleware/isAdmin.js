function isAdmin(req, res, next) {
  try {
    const { user } = req;

    if (user.role_id === 2) {
      return next();
    }

    return res.status(403).json({
      msg: "Unauthorized",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}

module.exports = isAdmin;
