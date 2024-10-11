"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Device.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });

      Device.hasOne(models.RefreshToken, {
        foreignKey: "device_id",
        onDelete: "CASCADE",
      });
    }
  }
  Device.init(
    {
      user_id: DataTypes.UUID,
      device_type: DataTypes.STRING,
      device_brand: DataTypes.STRING,
      device_model: DataTypes.STRING,
      device_os: DataTypes.STRING,
      device_os_version: DataTypes.STRING,
      user_agent: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Device",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Device;
};
