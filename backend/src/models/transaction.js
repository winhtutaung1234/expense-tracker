"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Account, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
      });

      Transaction.belongsTo(models.Category, {
        foreignKey: "category_id",
        onDelete: "CASCADE",
      });

      Transaction.belongsTo(models.Currency, {
        foreignKey: "currency_id",
        onDelete: "CASCADE",
      });
    }
  }
  Transaction.init(
    {
      account_id: DataTypes.BIGINT.UNSIGNED,
      category_id: DataTypes.BIGINT.UNSIGNED,
      transaction_type: DataTypes.ENUM("income", "expense", "transfer"),
      amount: DataTypes.DECIMAL,
      currency_id: DataTypes.BIGINT.UNSIGNED,
      description: DataTypes.TEXT,
      exchange_rate: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Transaction",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Transaction;
};
