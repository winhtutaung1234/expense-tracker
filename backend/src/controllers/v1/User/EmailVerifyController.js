require("dotenv").config();

const { User } = require("../../../models");
const asyncHandler = require("express-async-handler");

const generateAccessAndRefreshTokens = require("../../../middlewares/AuthMiddleware/generateAccessAndRefreshTokens");
const setJwtRefreshCookie = require("../../../utils/auth/setJwtRefreshCookie");
const EmailService = require("../../../services/v1/EmailService");
const errResponse = require("../../../utils/error/errResponse");

module.exports = {
  emailVerify: asyncHandler(async (req, res) => {
    const { user_id, token } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      throw errResponse("User not found", 404, "user");
    }
    console.log("user form verify controller: ", user);

    const result = await EmailService.EmailVerify({ user, token });

    if (!result) {
      throw errResponse("Email verify failed", 400, "email_verify");
    } else {
      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user);
      setJwtRefreshCookie(res, refreshToken);

      return res.json({
        msg: "User email verification successful",
        accessToken,
      });
    }
  }),

  resendEmailVerify: asyncHandler(async (req, res) => {
    const { token } = req.body;
    const result = await EmailService.resendEmailVerify(token);

    if (!result) {
      throw errResponse(
        "Resend Email verification link failed",
        400,
        "email_resend"
      );
    } else {
      return res.json({ msg: "Email verification link resent" });
    }
  }),
};
