"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transfers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      transaction_id: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      from_account_id: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      to_account_id: {
        type: Sequelize.BIGINT.UNSIGNED,
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
    await queryInterface.dropTable("transfers");
  },
};
