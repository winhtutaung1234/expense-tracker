"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transfer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transfer.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
        onDelete: "CASCADE",
      });

      Transfer.belongsTo(models.Account, {
        foreignKey: "from_account_id",
        as: "fromAccount", // Alias for the from account
        onDelete: "CASCADE",
      });
      Transfer.belongsTo(models.Account, {
        foreignKey: "to_account_id",
        as: "toAccount", // Alias for the to account
        onDelete: "CASCADE",
      });
    }
  }
  Transfer.init(
    {
      transaction_id: DataTypes.BIGINT.UNSIGNED,
      from_account_id: DataTypes.BIGINT.UNSIGNED,
      to_account_id: DataTypes.BIGINT.UNSIGNED,
    },
    {
      sequelize,
      modelName: "Transfer",
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  return Transfer;
};
