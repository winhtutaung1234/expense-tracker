"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Currency.hasMany(models.Account, {
        foreignKey: "currency_id",
        onDelete: "CASCADE",
      });

      Currency.hasMany(models.Denomination, {
        foreignKey: "currency_id",
        onDelete: "CASCADE",
      });

      Currency.hasMany(models.Transaction, {
        foreignKey: "currency_id",
        onDelete: "CASCADE",
      });
    }
  }
  Currency.init(
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING(3),
      symbol: DataTypes.STRING,
      symbol_position: DataTypes.ENUM("before", "after"),
      decimal_places: DataTypes.TINYINT.UNSIGNED,
    },
    {
      sequelize,
      modelName: "Currency",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Currency;
};
