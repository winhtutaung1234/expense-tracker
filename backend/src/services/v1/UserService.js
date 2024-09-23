require("dotenv").config();

const { User } = require("../../models");
const errResponse = require("../../utils/error/errResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateEmailVerificationToken = require("../../utils/auth/generateEmailVerificationToken");
const sendEmailQueue = require("../../queues/emailQueue");
const generateAccessAndRefreshTokens = require("../../middlewares/AuthMiddleware/generateAccessAndRefreshTokens");

class UserService {
  async register({ role_id, name, email, password, confirmpassword }) {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      throw errResponse("User already exists", 400, "user");
    }

    if (password !== confirmpassword) {
      throw errResponse("Passwords do not match", 400, "password");
    }

    const user = await User.create({
      role_id: role_id ? role_id : 1,
      name,
      email,
      password: await bcrypt(password, 10),
    });

    return user;
  }

  async sendEmailVerification(user) {
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

      // generate email-verify token for re-verify
      const emailVerifyToken = jwt.sign(
        { id: user.id },
        process.env.EMAIL_VERIFY_SECRET
      );

      return emailVerifyToken;
    } else {
      throw errResponse("Verification link not found", 404, "email_verify");
    }
  }

  async login(email, password) {
    const user = await User.findOne({ where: email });

    if (!user) {
      throw errResponse("User not found", 404, "user");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw errResponse("Incorrect password", 400, "password");
    }

    if (!user.email_verify_at) {
    } else {
      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user);

      return { accessToken, refreshToken };
    }
  }
}

module.exports = new UserService();
