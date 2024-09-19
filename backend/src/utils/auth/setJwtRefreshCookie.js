const setJwtRefreshCookie = (res, refreshToken) => {
  res.cookie("jwt_refresh", refreshToken, {
    httpOnly: true,
    maxAge: 10 * 24 * 60 * 60 * 1000, // expires in 10 days
  });
};

module.exports = setJwtRefreshCookie;
