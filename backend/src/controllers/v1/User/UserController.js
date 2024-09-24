require("dotenv").config();

const { User } = require("../../../models");
const { Role } = require("../../../models");
const { RefreshToken } = require("../../../models");

const asyncHandler = require("express-async-handler");
const UserResource = require("../../../resources/UserResource");

const sendEmailQueue = require("../../../queues/emailQueue");

// get access and refresh tokens
const generateAccessAndRefreshTokens = require("../../../middlewares/AuthMiddleware/generateAccessAndRefreshTokens");
// get email verificaton link
const generateEmailVerificationToken = require("../../../utils/auth/generateEmailVerificationToken");
// set the refresh token to cookie with http only
const setJwtRefreshCookie = require("../../../utils/auth/setJwtRefreshCookie");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserService = require("../../../services/v1/UserService");
const EmailService = require("../../../services/v1/EmailService");
const errResponse = require("../../../utils/error/errResponse");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const users = await UserService.getAllUsers();
    if (!users) throw errResponse("Users not found", 404, "user");
    return res.json(UserResource.collection(users));
  }),

  show: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await UserService.getUser(id);
    if (!user) throw errResponse("User not found", 404, "user");
    return res.json(new UserResource(user).exec());
  }),

  verify: asyncHandler(async (req, res) => {
    const { user } = req;

    return res.json(user);
  }),

  register: asyncHandler(async (req, res) => {
    const user = await UserService.register(req.body);

    if (user) {
      await EmailService.sendEmailVerificationLink(user);

      return res.status(201).json({ msg: "User register success" });
    } else {
      throw errResponse("User not found", 404, "user");
    }
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserService.login(email, password);

    // if user email_verified_at has date
    if (user.email_verified_at) {
      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user);

      setJwtRefreshCookie(res, refreshToken);

      return res.json({ accessToken });
    }

    if (!user.email_verified_at) {
      await EmailService.sendEmailVerificationLink(user);
      return res.json({ msg: "Please verify your email" });
    }
  }),

  refresh: asyncHandler(async (req, res) => {
    const { jwt_refresh } = req.cookies;

    if (!jwt_refresh) {
      throw errResponse("Jwt refresh not found", 401, "jwt_refresh");
    }

    try {
      const user = await UserService.refreshToken(jwt_refresh);
      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user);

      setJwtRefreshCookie(res, refreshToken);

      return res.json({
        accessToken,
      });
    } catch (err) {
      if (
        err.message === "Jwt refresh expired" ||
        err.message === "Invalid refresh token"
      ) {
        res.cookie("jwt_refresh", "", { maxAge: 1 }); // Clear cookie
      }
      throw err;
    }
  }),

  destroy: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await UserService.deleteUser(id);
    if (!result) {
      throw errResponse("User deleted failed", 400, "user");
    }
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
