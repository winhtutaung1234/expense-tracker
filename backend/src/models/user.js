"use strict";
const { Model, Op } = require("sequelize");
const bcrypt = require("bcrypt");
const errRespones = require("../utils/error/errResponse");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, {
        onDelete: "CASCADE",
        foreignKey: "role_id",
      });

      User.hasOne(models.EmailVerificationToken, {
        onDelete: "CASCADE",
        foreignKey: "user_id",
      });

      User.hasOne(models.RefreshToken, {
        onDelete: "CASCADE",
        foreignKey: "user_id",
      });

      User.hasMany(models.Account, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      role_id: DataTypes.BIGINT.UNSIGNED,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      email_verified_at: DataTypes.DATE,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      underscored: true,
      paranoid: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
      deletedAt: "deleted_at",
    }
  );
  return User;
};
