"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "accounts",
      [
        {
          user_id: 1,
          name: "Primary Checking Account",
          balance: 1000.0,
          currency_id: 1,
          description: "Main account for daily transactions.",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("accounts", null, {});
  },
};
