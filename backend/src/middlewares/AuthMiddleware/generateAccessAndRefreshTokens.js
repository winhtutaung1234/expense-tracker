require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { RefreshToken } = require("../../models");

async function generateAccessAndRefreshTokens(user, device_id, user_agent) {
  const accessToken = jwt.sign(
    {
      user: {
        id: user.id,
        role_id: user.role_id,
        name: user.name,
        email: user.email,
        email_verified_at: user.email_verified_at,
      },
      device: {
        id: device_id,
        user_agent,
      },
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      device_id,
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
    token: await bcrypt.hash(refreshToken, 10),
    expires_at,
    device_id,
  });

  return { accessToken, refreshToken };
}

module.exports = generateAccessAndRefreshTokens;
