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
    }

    static async register({
      name,
      email,
      phone_number,
      password,
      confirmpassword,
    }) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        throw errRespones("User already exists with that email", 400);
      }

      if (password !== confirmpassword) {
        throw errRespones("Incorrect password", 400);
      }

      const user = await User.create({
        role_id: 1,
        name,
        email,
        phone_number,
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
        throw errRespones("User not Found", 404);
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw errRespones("Incorrect password", 400);
      }

      if (!user.email_verified) {
        throw errRespones(
          "User's email not verified. Please check your email for verification link.",
          403
        );
      }

      return user;
    }
  }
  User.init(
    {
      role_id: DataTypes.INTEGER,
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
