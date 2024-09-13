"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsTo(models.Currency, {
        foreignKey: "currency_id",
        onDelete: "CASCADE",
      });

      Account.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });

      Account.hasMany(models.Transcation, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
      });
    }
  }
  Account.init(
    {
      user_id: DataTypes.BIGINT.UNSIGNED,
      name: DataTypes.STRING,
      balance: DataTypes.DECIMAL,
      currency_id: DataTypes.BIGINT.UNSIGNED,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Account",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Account;
};
