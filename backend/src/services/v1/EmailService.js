const { User, EmailVerificationToken } = require("../../models");

const sendEmailQueue = require("../../queues/emailQueue");
const generateEmailVerificationToken = require("../../utils/auth/generateEmailVerificationToken");
const validateEmailVerificationToken = require("../../utils/auth/validateEmailVerificationToken");
const errResponse = require("../../utils/error/errResponse");

class EmailService {
  async sendEmailVerificationLink(user) {
    // generate url link for send email
    const verificationLink = await generateEmailVerificationToken({
      id: user.id,
      email: user.email,
    });

    if (verificationLink) {
      // send email with verification url link
      sendEmailQueue.add({
        email: user.email,
        url: verificationLink,
      });

      return true;
    } else {
      throw errResponse("Verification link not found", 404, "email_verify");
    }
  }

  async EmailVerify({ user, token }) {
    console.log("user id from email verify: ", user);
    const emailVerifyToken = await validateEmailVerificationToken(
      user.id,
      token
    );

    if (!emailVerifyToken) {
      throw errResponse("Email verify token not found", 404, "email_verify");
    }

    user.email_verified_at = new Date();
    await emailVerifyToken.destroy();
    await user.save();

    return true;
  }

  async resendEmailVerify(token) {
    const emailVerifyToken = await EmailVerificationToken.findOne({
      where: token,
    });

    if (!emailVerifyToken) {
      throw errResponse("Invalid token", 400, "email_verify");
    }

    const user = await User.findByPk(emailVerifyToken.user_id);
    if (!user) {
      throw errResponse("User not found", 404, "email_verify");
    }

    if (user.email_verified_at) {
      await emailVerifyToken.destroy();
      throw errResponse(
        "Email already verified.Please Login",
        400,
        "email_verify"
      );
    } else {
      await this.sendEmailVerificationLink(user);
      return true;
    }
  }
}

module.exports = new EmailService();
