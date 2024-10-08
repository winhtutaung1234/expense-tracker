"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasMany(models.User, {
        onDelete: "CASCADE",
        foreignKey: "role_id",
      });

      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: "role_id",
        otherKey: "permission_id",
        onDelete: "CASCADE",
      });

      Role.hasOne(models.Limit, {
        foreignKey: "role_id",
        onDelete: "CASCADE",
      });
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Role",
      underscored: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
  return Role;
};
