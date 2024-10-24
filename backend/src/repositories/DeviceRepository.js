const { Device } = require("../models");
const errResponse = require("../utils/error/errResponse");
const generateUUID = require("../utils/token/generateUUID");
const DeviceDetector = require("node-device-detector");

class DeviceRepository {
  async getDevicesByUser(user_id) {
    try {
      const devices = await Device.findAll({ where: { user_id } });

      return devices;
    } catch (err) {
      throw err;
    }
  }

  async getDeviceById(id, user_id) {
    try {
      const device = await Device.findOne({ where: { id, user_id } });

      if (!device) throw errResponse("Device not found", 404, "device");

      return device;
    } catch (err) {
      throw err;
    }
  }

  async createDevice(user_id, user_agent) {
    try {
      const uuid = generateUUID();

      const detector = new DeviceDetector();
      const deviceInfo = detector(user_agent);

      const data = {
        id: uuid,
        user_id,
        device_type: deviceInfo.device.type,
        device_brand: deviceInfo.device.brand,
        device_model: deviceInfo.device.model,
        device_os: deviceInfo.os.name,
        device_os_version: deviceInfo.os.version,
        user_agent,
      };

      const device = await Device.create(data);
      return device;
    } catch (err) {
      throw err;
    }
  }

  async updateDevice(id, data) {
    try {
      const device = await Device.findByPk(id);

      if (!device) throw errResponse("Device not found", 404, "device");

      const result = await device.update(data);

      if (!result) {
        throw errResponse("Update failed", 400, "device");
      }

      return device;
    } catch (err) {
      throw err;
    }
  }

  async deleteDevice(id) {
    try {
      const device = await Device.findByPk(id);

      if (!device) throw errResponse("Device not found", 404, "device");

      const result = await device.destroy();

      if (!result) {
        throw errResponse("Delete failed", 400, "device");
      } else {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new DeviceRepository();
