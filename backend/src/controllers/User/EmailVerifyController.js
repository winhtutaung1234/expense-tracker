require("dotenv").config();

const { User, EmailVerificationToken } = require("../../models");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../utils/sendEmail");
const generateEmailVerificationToken = require("../../utils/emailVerification/generateEmailVerificationToken");
const validateEmailVerificationToken = require("../../utils/emailVerification/validateEmailVerificationToken");
const sendEmailQueue = require("../../queues/emailQueue");
const generateAccessAndRefreshTokens = require("../../utils/generateAccessAndRefreshTokens");
const jwt = require("jsonwebtoken");
const setJwtRefreshCookie = require("../../utils/cookies/setJwtRefreshCookie");

module.exports = {
  emailVerify: asyncHandler(async (req, res) => {
    const { user_id, token } = req.body;

    const emailToken = await validateEmailVerificationToken(user_id, token);

    if (!emailToken)
      return res.status(400).json({ msg: "Invalid or expired token" });

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.email_verified = true;
    user.email_verified_at = new Date();

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);
    setJwtRefreshCookie(res, refreshToken);

    await emailToken.destroy();
    await user.save();

    return res.json({
      msg: "User email verification successful",
      accessToken,
    });
  }),

  resendEmailVerify: asyncHandler(async (req, res) => {
    const { email_verify_token } = req.cookies;

    if (!email_verify_token) {
      return res.status(400).json({ msg: "No verification token found" });
    }

    const decoded = jwt.verify(email_verify_token, process.env.EMAIL_VERIFY_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.email_verified)
      return res.status(400).json({ msg: "Email already verified" });
    await EmailVerificationToken.destroy({ where: { user_id: user.id } });

    const verificationToken = await generateEmailVerificationToken({user_id: user.id, email: user.email});
    if (verificationToken) {
      sendEmailQueue.add({ email: user.email, url: verificationToken.url });
      return res.json({ msg: "Verification email resent" });
    }
  }),
};
