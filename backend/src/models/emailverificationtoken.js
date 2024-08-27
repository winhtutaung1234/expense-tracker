"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmailVerificationToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmailVerificationToken.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: "user_id",
      });
    }
  }
  EmailVerificationToken.init(
    {
      user_id: DataTypes.BIGINT.UNSIGNED,
      token: DataTypes.STRING,
      expires_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "EmailVerificationToken",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return EmailVerificationToken;
};
