"use strict";
const { Model, Op } = require("sequelize");
const bcrypt = require("bcrypt");
const errRespones = require("../utils/errResponse");

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

    static async register({
      name,
      email,
      phone_number,
      password,
      confirmpassword,
    }) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        throw errRespones("User already exists. Please login.", 400);
      }

      if (password !== confirmpassword) {
        throw errRespones("Passwords do not match", 400);
      }

      const user = await User.create({
        role_id: 1,
        name,
        email,
        phone_number,
        email_verified: false,
        password: await bcrypt.hash(password, 10),
      });

      return user;
    }

    // login -> loginInfo (email, phone_number)
    static async login({ loginInfo, password }) {
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: loginInfo }, { phone_number: loginInfo }],
        },
      });

      if (!user) {
        throw errRespones("User not Found. Register first", 401);
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw errRespones("Incorrect password", 400);
      }

      return user;
    }
  }
  User.init(
    {
      role_id: DataTypes.BIGINT.UNSIGNED,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      email_verified: DataTypes.BOOLEAN,
      email_verified_at: DataTypes.DATE,
      phone_number: DataTypes.STRING,
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
