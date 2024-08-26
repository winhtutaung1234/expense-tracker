require("dotenv").config();

const jwt = require("jsonwebtoken");
const { RefreshToken } = require("../models");

async function generateAccessAndRefreshTokens(user) {
  const accessToken = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      email_verified: user.email_verified,
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

  await RefreshToken.create({
    user_id: user.id,
    token: refreshToken,
    expires_at,
  });

  return { accessToken, refreshToken };
}

module.exports = generateAccessAndRefreshTokens;
