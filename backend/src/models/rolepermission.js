"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RolePermission.init(
    {
      role_id: DataTypes.BIGINT.UNSIGNED,
      permission_id: DataTypes.BIGINT.UNSIGNED,
    },
    {
      sequelize,
      modelName: "RolePermission",
      underscored: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
  return RolePermission;
};
