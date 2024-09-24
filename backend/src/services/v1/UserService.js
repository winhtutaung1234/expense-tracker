require("dotenv").config();

const { User } = require("../../models");
const { Role } = require("../../models");
const { RefreshToken } = require("../../models");
const errResponse = require("../../utils/error/errResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateAccessAndRefreshTokens = require("../../middlewares/AuthMiddleware/generateAccessAndRefreshTokens");
const EmailService = require("./EmailService");

class UserService {
  async getAllUsers() {
    const users = await User.findAll({ include: Role });
    return users;
  }

  async getUser(userId) {
    const user = await User.findByPk(userId, { include: Role });
    return user;
  }

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

  async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw errResponse("User not found", 404, "user");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw errResponse("Incorrect password", 400, "password");
    }

    return user;
  }

  async refreshToken(jwt_refresh) {
    let decoded;

    try {
      decoded = jwt.verify(jwt_refresh, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      if (err.message === "jwt expired") {
        throw errResponse("Jwt refresh expired", 401, "jwt_refresh");
      }
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw errResponse("User not found", 404, "user");
    }

    const refresh = await RefreshToken.findOne({
      where: { user_id: decoded.id },
    });

    if (!(await bcrypt.compare(jwt_refresh, refresh.token))) {
      throw errResponse("Invalid refresh token", 400, "jwt_refresh");
    }

    await refresh.destroy();
    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw errResponse("User not found", 404, "user");
    }

    await user.destroy();
    return true;
  }
}

module.exports = new UserService();
