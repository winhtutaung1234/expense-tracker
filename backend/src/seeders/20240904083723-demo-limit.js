"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("limits", [
      {
        role_id: 1,
        max_accounts: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        max_accounts: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        max_accounts: 20,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("limits", null, {});
  },
};
