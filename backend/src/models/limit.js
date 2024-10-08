"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Limit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Limit.belongsTo(models.Role, {
        foreignKey: "role_id",
        onDelete: "CASCADE",
      });
    }
  }
  Limit.init(
    {
      role_id: DataTypes.BIGINT.UNSIGNED,
      max_accounts: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Limit",
      underscored: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
  return Limit;
};
