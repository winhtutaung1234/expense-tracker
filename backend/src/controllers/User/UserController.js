const { User } = require("../../models");
const { Role } = require("../../models");
const { EmailVerificationToken } = require("../../models");
const { RefreshToken } = require("../../models");

const asyncHandler = require("express-async-handler");
const generateAccessAndRefreshTokens = require("../../utils/generateAccessAndRefreshTokens");
const UserResource = require("../../resources/UserResource");
const sendEmail = require("../../utils/sendEmail");
const generateToken = require("../../utils/generateToken");
const generateEmailVerificationToken = require("../../utils/generateEmailVerificationToken");

const include = [Role];

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const users = await User.findAll({ include });
    return res.json(UserResource.collection(users));
  }),

  show: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByPk(id, { include });
    return res.json(new UserResource(user).exec());
  }),

  verify: asyncHandler(async (req, res) => {
    const { user } = req;

    return res.json(user);
  }),

  emailVerify: asyncHandler(async (req, res) => {
    const { user_id, token } = req.query;

    const emailVerifyToken = await EmailVerificationToken.findOne({
      where: { user_id, token },
    });

    if (!emailVerifyToken) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    if (Date.now() > new Date(emailVerifyToken.expires_at).getTime()) {
      await emailVerifyToken.destroy();

      return res.status(400).json({
        msg: "Email verify token expired",
      });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.email_verified = true;
    user.email_verified_at = new Date();

    await emailVerifyToken.destroy();

    await user.save();

    return res.json({ msg: "User email verification success" });
  }),

  create: asyncHandler(async (req, res) => {
    const user = await User.register(req.body);

    const token = await generateToken();
    const url = `http://localhost:8000/api/email-verify?user_id=${user.id}&token=${token}`;

    await generateEmailVerificationToken({ userId: user.id, token });

    await sendEmail({
      from: "expensetacker.com",
      to: user.email,
      subject: "email verification",
      url,
    });

    return res.status(201).json(user);
  }),

  login: asyncHandler(async (req, res) => {
    const user = await User.login(req.body);

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user
    );

    return res.json({ accessToken, refreshToken });
  }),

  refresh: asyncHandler(async (req, res) => {
    const { jwt_refresh } = req.body;

    const refresh = await RefreshToken.findOne({
      refresh_token: jwt_refresh,
    });

    if (!refresh) {
      return res.status(400).json({
        msg: "Invalid refresh token",
      });
    }

    if (Date.now() > new Date(refresh.expires_at).getTime()) {
      await refresh.destroy();
      return res.status(404).json({
        msg: "Refresh token expired",
      });
    }

    const user = await User.findByPk(refresh.user_id);

    if (!user) return res.status(400).json({ msg: "User not found" });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user
    );

    await refresh.destroy();

    return res.json({
      accessToken,
      refreshToken,
    });
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user)
      return res.status(404).json({ msg: `User with ID ${id} not found` });

    await user.destroy();

    return res.json({ msg: "User deleted successfully" });
  }),

  restore: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByPk(id, { paranoid: false });

    if (!user)
      return res.status(404).json({ msg: `User with ID ${id} not found` });

    await user.restore();

    return res.json({ msg: "User restored successfully" });
  }),
};
