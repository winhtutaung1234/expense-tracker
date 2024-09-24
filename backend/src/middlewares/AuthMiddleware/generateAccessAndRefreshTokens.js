require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { RefreshToken } = require("../../models");

async function generateAccessAndRefreshTokens(user) {
  // check if refresh token already exists
  const refreshExists = await RefreshToken.findOne({
    where: { user_id: user.id },
  });

  // if exists delete it from db
  if (refreshExists) {
    await RefreshToken.destroy({ where: { user_id: user.id } });
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      role_id: user.role_id,
      name: user.name,
      email: user.email,
      email_verified_at: user.email_verified_at,
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
    token: await bcrypt.hash(refreshToken, 10),
    expires_at,
  });

  return { accessToken, refreshToken };
}

module.exports = generateAccessAndRefreshTokens;
