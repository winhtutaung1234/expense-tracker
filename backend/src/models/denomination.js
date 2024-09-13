"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Denomination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Denomination.belongsTo(models.Currency, {
        foreignKey: "currency_id",
        onDelete: "CASCADE",
      });
    }
  }
  Denomination.init(
    {
      currency_id: DataTypes.BIGINT.UNSIGNED,
      value: DataTypes.DECIMAL,
    },
    {
      sequelize,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      modelName: "Denomination",
    }
  );
  return Denomination;
};
