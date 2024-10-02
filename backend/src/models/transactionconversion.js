"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransactionConversion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransactionConversion.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
        onDelete: "CASCADE",
      });
    }
  }
  TransactionConversion.init(
    {
      transaction_id: DataTypes.BIGINT.UNSIGNED,
      converted_amount: DataTypes.DECIMAL,
      converted_currency_id: DataTypes.BIGINT.UNSIGNED,
      exchange_rate: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "TransactionConversion",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return TransactionConversion;
};
