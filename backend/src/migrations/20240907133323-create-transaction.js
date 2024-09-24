"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      account_id: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      category_id: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      transaction_type: {
        allowNull: false,
        type: Sequelize.ENUM("income", "expense", "transfer"),
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      currency_id: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      exchange_rate: {
        allowNull: false,
        type: Sequelize.DECIMAL(15, 5),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transactions");
  },
};
