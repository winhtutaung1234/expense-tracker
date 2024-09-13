"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("permissions", [
      // Account permissions -> (CRUD)
      {
        name: "create_account",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "read_account",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "update_account",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "delete_account",
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Currency permissions -> (CUD)
      {
        name: "create_currency",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "update_currency",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "delete_currency",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // User permissions -> (soft delete, restore) -> only for admin
      {
        name: "delete_user",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "restore_user",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Transcation permissions -> for authenticated user
      {
        name: "read_transcation",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "create_transcation",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "edit_transcation",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "delete_transcation",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
