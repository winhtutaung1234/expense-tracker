require("dotenv").config();

const asyncHandler = require("express-async-handler");
const UserResource = require("../../../resources/UserResource");

const UserService = require("../../../services/v1/UserService");
const EmailService = require("../../../services/v1/EmailService");
const errResponse = require("../../../utils/error/errResponse");

module.exports = {
  findAll: asyncHandler(async (req, res) => {
    const users = await UserService.findUsers();
    return res.json(UserResource.collection(users));
  }),

  show: asyncHandler(async (req, res) => {
    const user = await UserService.getUser(req.params.id);
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
    const user_agent = req.headers["user-agent"];

    const result = await UserService.login(email, password, user_agent, res);

    if (result.accessToken) {
      return res.json({ accessToken: result.accessToken });
    } else {
      return res.json({
        msg: "We sent verification link to your email. Please verify it first.",
      });
    }
  }),

  refresh: asyncHandler(async (req, res) => {
    try {
      const accessToken = await UserService.refreshToken(
        req.cookies.jwt_refresh,
        res
      );

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
    await UserService.deleteUser(req.params.id);
    return res.json({ msg: "User deleted successfully" });
  }),

  restore: asyncHandler(async (req, res) => {
    await UserService.restoreDelete(req.params.id);
    return res.json({ msg: "User restored successfully" });
  }),

  logout: asyncHandler(async (req, res) => {
    const { user } = req;
    const user_agent = req.headers["user-agent"];

    await UserService.userLogout(user.id, user_agent, res);

    return res.json({ msg: "User logout successfully" });
  }),
};
