const { User } = require("../../models");
const { EmailVerificationToken } = require("../../models");

const asyncHandler = require("express-async-handler");
const sendEmail = require("../../utils/sendEmail");

const generateEmailVerificationToken = require("../../utils/emailVerification/generateEmailVerificationToken");
const validateEmailVerificationToken = require("../../utils/emailVerification/validateEmailVerificationToken");
const sendEmailQueue = require("../../queues/emailQueue");

module.exports = {
  emailVerify: asyncHandler(async (req, res) => {
    const { user_id, token } = req.query;

    const emailToken = await validateEmailVerificationToken(user_id, token);

    if (emailToken) {
      const user = await User.findByPk(user_id);
      if (!user) return res.status(404).json({ msg: "User not found" });

      user.email_verified = true;
      user.email_verified_at = new Date();

      await emailToken.destroy();

      await user.save();

      return res.json({ msg: "User email verification success" });
    }
  }),

  resendEmailVerify: asyncHandler(async (req, res) => {
    const { user } = req;

    const userExists = await User.findByPk(user.id);

    if (!userExists) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.email_verified) {
      return res.status(400).json({ msg: "Email already verified" });
    }

    await EmailVerificationToken.destroy({ where: { user_id: user.id } });

    const verificationToken = await generateEmailVerificationToken(user.id);

    if (verificationToken) {
      // sendEmailQueue.add({ email: user.email, url: verificationToken.url });

      sendEmail({
        from: "expensetacker.com",
        to: user.email,
        subject: "email verification",
        url: verificationToken.url,
      });

      return res.json({ msg: "Resent email verification" });
    }
  }),
};
