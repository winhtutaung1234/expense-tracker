require("dotenv").config();

const { User, Device, RefreshToken } = require("../../models");
const errResponse = require("../../utils/error/errResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateUUID = require("../../utils/token/generateUUID");
const UserRepository = require("../../repositories/UserRepository");

const EmailService = require("./EmailService");

const generateAccessAndRefreshTokens = require("../../middlewares/AuthMiddleware/generateAccessAndRefreshTokens");
const setJwtRefreshCookie = require("../../utils/auth/setJwtRefreshCookie");
const DeviceService = require("./DeviceService");
const DeviceRepository = require("../../repositories/DeviceRepository");

class UserService {
  async findUsers() {
    try {
      const users = await UserRepository.getAllUsers();
      return users;
    } catch (err) {
      throw err;
    }
  }

  async getUser(id) {
    try {
      const user = await UserRepository.getUserByIdWithAssociation(id);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async register({ role_id, name, email, password, confirmpassword }) {
    try {
      const userExist = await UserRepository.getUserByEmail(email);

      if (userExist) {
        throw errResponse("User already exists", 400, "user");
      }

      if (password !== confirmpassword) {
        throw errResponse("Passwords do not match", 400, "password");
      }

      const user = await UserRepository.createUser({
        role_id: role_id ? role_id : 1,
        name,
        email,
        password: await bcrypt.hash(password, 10),
      });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async login(email, password, user_agent, res) {
    try {
      const user = await UserRepository.getUserByEmail(email);

      if (!(await bcrypt.compare(password, user.password))) {
        throw errResponse("Incorrect password", 400, "password");
      }

      if (user.email_verified_at) {
        const deviceId = await DeviceService.getDeviceId(user.id, user_agent);
        const { accessToken, refreshToken } =
          await generateAccessAndRefreshTokens(user, deviceId, user_agent);

        setJwtRefreshCookie(res, refreshToken);

        return accessToken;
      } else {
        return await EmailService.sendEmailVerificationLink(user);
      }
    } catch (err) {
      throw err;
    }
  }

  async verifyRefreshToken(refresh) {
    try {
      const decoded = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET);
      return decoded;
    } catch (err) {
      if (err.message === "jwt expired") {
        throw errResponse("Jwt refresh expired", 401, "jwt_refresh");
      }
    }
  }

  async refreshToken(jwt_refresh, res) {
    try {
      if (!jwt_refresh)
        throw errResponse("Jwt refresh token not found", 404, "jwt_refresh");

      const decoded = await this.verifyRefreshToken(jwt_refresh);

      const user = await UserRepository.getUserById(decoded.id);

      const device = await DeviceRepository.getDeviceById(
        decoded.device_id,
        user.id
      );

      const refresh = await RefreshToken.findOne({
        where: { user_id: user.id, device_id: device.id },
      });

      if (!refresh)
        throw errResponse("Refresh token ont found", 404, "refresh");

      if (!(await bcrypt.compare(jwt_refresh, refresh.token))) {
        throw errResponse("Invalid refresh token", 400, "jwt_refresh");
      }

      await refresh.destroy();

      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(
          user,
          device.id,
          device.user_agent
        );

      setJwtRefreshCookie(res, refreshToken);

      return accessToken;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id) {
    try {
      return await UserRepository.deleteUser(id);
    } catch (err) {
      throw err;
    }
  }

  async restoreDelete(id) {
    try {
      return await UserRepository.restoreUserFromDelete(id);
    } catch (err) {
      throw err;
    }
  }

  async userLogout(user_id, user_agent, res) {
    try {
      const user = await UserRepository.getUserById(user_id);

      if (user) {
        const device = await Device.findOne({ where: { user_id, user_agent } });

        if (!device)
          throw errResponse(
            "You're trying to access a device that's not registered to your account",
            404,
            "device"
          );

        await RefreshToken.destroy({
          where: { user_id, device_id: device.id },
        });

        res.cookie("jwt_refresh", "", { maxAge: 1 });

        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new UserService();
