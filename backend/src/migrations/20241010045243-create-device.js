"use strict";

const { fn } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("devices", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "users",
          key: "id",
        },
      },
      device_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      device_brand: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      device_model: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      device_os: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      device_os_version: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_agent: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("devices");
  },
};
