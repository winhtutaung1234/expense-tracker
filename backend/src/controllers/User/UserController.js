require("dotenv").config();

const { User } = require("../../models");
const { Role } = require("../../models");
const { RefreshToken } = require("../../models");

const asyncHandler = require("express-async-handler");
const generateAccessAndRefreshTokens = require("../../utils/generateAccessAndRefreshTokens");
const UserResource = require("../../resources/UserResource");
const generateEmailVerificationToken = require("../../utils/emailVerification/generateEmailVerificationToken");
const sendEmailQueue = require("../../queues/emailQueue");
const setJwtRefreshCookie = require("../../utils/cookies/setJwtRefreshCookie");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/sendEmail");

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

    const verificationToken = await generateEmailVerificationToken(user);

    if (verificationToken) {
      sendEmailQueue.add({ email: user.email, url: verificationToken.url });

      const emailVerifyToken = jwt.sign(
        { id: user.id },
        process.env.EMAIL_VERIFY_SECRET
      );
      res.cookie("email_verify_token", emailVerifyToken, { httpOnly: true });

      return res.status(201).json({ msg: "User register success" });
    }
  }),

  login: asyncHandler(async (req, res) => {
    const user = await User.login(req.body);

    // if user email_verified
    if (user.email_verified) {
      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user);

      console.log("refreshtoken: ", refreshToken);

      setJwtRefreshCookie(res, refreshToken);

      return res.json({ accessToken });
    }

    if (!user.email_verified) {
      const verificationToken = await generateEmailVerificationToken({
        user_id: user.id,
        email: user.email,
      });

      if (verificationToken) {
        sendEmailQueue.add({ email: user.email, url: verificationToken.url });

        const emailVerifyToken = jwt.sign(
          { id: user.id },
          process.env.EMAIL_VERIFY_SECRET
        );

        res.cookie("email_verify_token", emailVerifyToken, { httpOnly: true });

        return res.json({ msg: "Please verify your email" });
      }
    }
  }),

  refresh: asyncHandler(async (req, res) => {
    const { jwt_refresh } = req.cookies;

    if (!jwt_refresh) {
      return res.status(404).json({
        msg: "Refresh token not found",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(jwt_refresh, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      if (err.message === "jwt expired") {
        res.cookie("jwt_refresh", "", { maxAge: 1 });
        return res.status(401).json({ msg: "Jwt refresh expired" });
      }
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const refresh = await RefreshToken.findOne({
      where: { user_id: decoded.id },
    });

    if (!(await bcrypt.compare(jwt_refresh, refresh.token))) {
      // delete the cookie of jwt refresh if tokens are not match
      res.cookie("jwt_refresh", "", { maxAge: 1 });
      return res.status(400).json({ msg: "Invalid refresh token" });
    }

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
    const { user } = req;

    const userExists = await User.findByPk(user.id);

    if (!userExists) return res.status(404).json({ msg: "User not found" });

    await RefreshToken.destroy({ where: { user_id: user.id } });

    res.cookie("jwt_refresh", "", { maxAge: 1 });

    return res.json({ msg: "User logout successfully" });
  }),
};
