"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("currencies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING(3),
        unique: true,
      },
      symbol: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      symbol_position: {
        allowNull: false,
        type: Sequelize.ENUM("before", "after"),
        defaultValue: "before",
      },
      decimal_places: {
        allowNull: false,
        type: Sequelize.TINYINT.UNSIGNED,
      },
      image: {
        unique: true,
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
    await queryInterface.dropTable("currencies");
  },
};
