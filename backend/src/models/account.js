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
    }
  }
  Account.init(
    {
      user_id: DataTypes.BIGINT.UNSIGNED,
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      balance: DataTypes.DECIMAL,
      currency: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Account",
    }
  );
  return Account;
};
