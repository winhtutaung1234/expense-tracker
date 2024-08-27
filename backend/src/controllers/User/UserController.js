const { User } = require("../../models");
const { Role } = require("../../models");
const { RefreshToken } = require("../../models");

const asyncHandler = require("express-async-handler");
const generateAccessAndRefreshTokens = require("../../utils/generateAccessAndRefreshTokens");
const UserResource = require("../../resources/UserResource");
const generateEmailVerificationToken = require("../../utils/emailVerification/generateEmailVerificationToken");
const sendEmailQueue = require("../../queues/emailQueue");
const setJwtRefreshCookie = require("../../utils/cookies/setJwtRefreshCookie");

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

  create: asyncHandler(async (req, res) => {
    const user = await User.register(req.body);
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user
    );

    setJwtRefreshCookie(res, refreshToken);

    const verificationToken = await generateEmailVerificationToken(user.id);

    if (verificationToken) {
      sendEmailQueue.add({ email: user.email, url: verificationToken.url });

      return res.status(201).json({ accessToken });
    }
  }),

  login: asyncHandler(async (req, res) => {
    const user = await User.login(req.body);

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user
    );

    setJwtRefreshCookie(res, refreshToken);

    const verificationToken = await generateEmailVerificationToken(user.id);

    if (verificationToken) {
      // sendEmailQueue.add({ email: user.email, url: verificationToken.url });

      sendEmail({
        from: "expensetacker.com",
        to: user.email,
        subject: "email verification",
        url: verificationToken.url,
      });

      return res.status(201).json({ accessToken });
    }

    return res.json({ accessToken });
  }),

  refresh: asyncHandler(async (req, res) => {
    const { jwt_refresh } = req.cookies;
    const { user_id } = req.body;

    const refresh = await RefreshToken.findOne({
      where: {
        user_id,
        token: jwt_refresh,
      },
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

    const user = await User.findByPk(user_id);

    if (!user) return res.status(400).json({ msg: "User not found" });

    await refresh.destroy();

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user
    );

    setJwtRefreshCookie(res, refreshToken);

    return res.json({
      accessToken,
    });
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

  logout: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const refreshToken = await RefreshToken.findOne({
      where: { user_id: id },
    });

    await refreshToken.destroy();

    res.cookie("jwt_refresh", "", { maxAge: 1 });

    return res.json({ msg: "User logout successfully" });
  }),
};
