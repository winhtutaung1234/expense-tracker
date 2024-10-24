const DeviceDetector = require("node-device-detector");
const DeviceRepository = require("../../repositories/DeviceRepository");
const UserRepository = require("../../repositories/UserRepository");
const errResponse = require("../../utils/error/errResponse");

class DeviceService {
  async findAll(user_id) {
    try {
      const devices = await DeviceRepository.getDevicesByUser(user_id);

      return devices;
    } catch (err) {
      throw err;
    }
  }

  async create(user_id, user_agent) {
    try {
      const device = await DeviceRepository.createDevice(user_id, user_agent);
      return device;
    } catch (err) {
      throw err;
    }
  }

  async update(id, data) {
    try {
      return await DeviceRepository.updateDevice(id, data);
    } catch (err) {
      throw err;
    }
  }

  async destroy(id) {
    try {
      return await DeviceRepository.deleteDevice(id);
    } catch (err) {
      throw err;
    }
  }

  // for login
  async getDeviceId(user_id, user_agent) {
    try {
      const devices = await DeviceRepository.getDevicesByUser(user_id);
      const device = devices.find((d) => d.user_agent === user_agent);

      let deviceId = null;

      if (device) {
        deviceId = device.id;
      } else {
        const createdDevice = await DeviceRepository.createDevice(
          user_id,
          user_agent
        );

        deviceId = createdDevice.id;
      }

      return deviceId;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new DeviceService();
