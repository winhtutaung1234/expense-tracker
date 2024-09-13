"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transcation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transcation.belongsTo(models.Account, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
      });

      Transcation.belongsTo(models.Category, {
        foreignKey: "category_id",
        onDelete: "CASCADE",
      });

      Transcation.belongsTo(models.Currency, {
        foreignKey: "currency_id",
        onDelete: "CASCADE",
      });
    }
  }
  Transcation.init(
    {
      account_id: DataTypes.BIGINT.UNSIGNED,
      category_id: DataTypes.BIGINT.UNSIGNED,
      transcation_type: DataTypes.ENUM("income", "expense", "transfer"),
      amount: DataTypes.DECIMAL,
      currency_id: DataTypes.BIGINT.UNSIGNED,
      description: DataTypes.TEXT,
      exchange_rate: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Transcation",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Transcation;
};
