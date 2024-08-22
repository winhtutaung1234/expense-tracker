require("dotenv").config();

const jwt = require("jsonwebtoken");
const { RefreshToken } = require("../models");
const { addSeconds } = require("date-fns");

async function generateAccessAndRefreshTokens(user) {
  const accessToken = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );

  const expires_at = new Date();
  expires_at.setDate(
    expires_at.getDate() + parseInt(process.env.JWT_REFRESH_EXPIRE)
  );
  // const refreshExpireSeconds = parseInt(process.env.JWT_REFRESH_EXPIRE, 10);
  // console.log("refreshExpireSeconds", refreshExpireSeconds);
  // const expires_at = new Date(Date.now() + refreshExpireSeconds * 1000);

  await RefreshToken.create({
    user_id: user.id,
    token: refreshToken,
    expires_at,
  });

  return { accessToken, refreshToken };
}

module.exports = generateAccessAndRefreshTokens;
