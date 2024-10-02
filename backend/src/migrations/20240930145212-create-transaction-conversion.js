"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaction_conversions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      transaction_id: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      converted_amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      converted_currency_id: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      exchange_rate: {
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
    await queryInterface.dropTable("transaction_conversions");
  },
};
