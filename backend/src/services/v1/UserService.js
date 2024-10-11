require("dotenv").config();

const { User, Device, Role, RefreshToken } = require("../../models");
const errResponse = require("../../utils/error/errResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DeviceDetector = require("node-device-detector");
const generateAccessAndRefreshTokens = require("../../middlewares/AuthMiddleware/generateAccessAndRefreshTokens");
const setJwtRefreshCookie = require("../../utils/auth/setJwtRefreshCookie");
const generateUUID = require("../../utils/token/generateUUID");

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
      password: await bcrypt.hash(password, 10),
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

    const device = await Device.findOne({
      where: { id: decoded.device_id, user_id: decoded.id },
    });

    if (!device) {
      throw errResponse(
        "You're trying to access a device that's not registered to your account",
        400,
        "device"
      );
    }

    const refresh = await RefreshToken.findOne({
      where: { user_id: decoded.id },
    });

    if (!(await bcrypt.compare(jwt_refresh, refresh.token))) {
      throw errResponse("Invalid refresh token", 400, "jwt_refresh");
    }

    await refresh.destroy();
    return { user, device };
  }

  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw errResponse("User not found", 404, "user");
    }

    await user.destroy();
    return true;
  }

  async restoreDelete(userId) {
    const user = await User.findByPk(userId, { paranoid: false });

    if (!user) {
      throw errResponse("User not found", 404, "user");
    }

    await user.restore();

    return true;
  }

  async getDeviceId(userId, userAgent) {
    try {
      const devices = await this.getUserDevices(userId);

      const device = await this.checkUserDevice(devices, userAgent);

      let deviceId = null;

      if (device) {
        deviceId = device.id;

        await RefreshToken.destroy({
          where: { user_id: userId, device_id: deviceId },
        });
      } else {
        const createdDevice = await this.createDeviceForUser(userId, userAgent);

        deviceId = createdDevice.id;
      }

      return deviceId;
    } catch (err) {
      throw errResponse(err.message, err.status || 500, "device");
    }
  }

  async getUserDevices(user_id) {
    try {
      const devices = await Device.findAll({ where: { user_id } });

      return devices;
    } catch (err) {
      throw errResponse(err.message, err.status || 500, "device");
    }
  }

  async checkUserDevice(devices, user_agent) {
    try {
      const device = devices.find((d) => d.user_agent === user_agent);
      console.log("check user device: ", device);
      return device;
    } catch (err) {
      throw errResponse(err.message, err.status || 500, "device");
    }
  }

  async createDeviceForUser(user_id, user_agent) {
    try {
      const user = await User.findByPk(user_id);
      if (!user) throw errResponse("User not found", 404, "user");

      const detector = new DeviceDetector();

      const deviceInfo = detector.detect(user_agent);

      const uuid = generateUUID();

      const device = await Device.create({
        id: uuid,
        user_id,
        device_type: deviceInfo.device.type,
        device_brand: deviceInfo.device.brand,
        device_model: deviceInfo.device.model,
        device_os: deviceInfo.os.name,
        device_os_version: deviceInfo.os.version,
        user_agent,
      });

      return device;
    } catch (err) {
      throw errResponse(err.message, err.status || 400, "device");
    }
  }
}

module.exports = new UserService();
