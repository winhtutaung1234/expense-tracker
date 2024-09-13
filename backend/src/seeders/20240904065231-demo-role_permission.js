"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("role_permissions", [
      // Role 1 -> User with account permissions
      {
        role_id: 1,
        permission_id: 1, // create_account
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 2, // read_account
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 3, // update_account
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 4, // delete_account
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        role_id: 1,
        permission_id: 10, // read_transaction
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 11, // create_transaction
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 12, // edit_transaction
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 13, // delete_transaction (if exists)
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Role 2 -> Premium User with account permissions
      {
        role_id: 2,
        permission_id: 1, // create_account
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        permission_id: 2, // read_account
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        permission_id: 3, // update_account
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        permission_id: 4, // delete_account
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        role_id: 2,
        permission_id: 10, // read_transaction
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        permission_id: 11, // create_transaction
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        permission_id: 12, // edit_transaction
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        permission_id: 13, // delete_transaction (if exists)
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Role 3 -> Admin with all permissions
      {
        role_id: 3,
        permission_id: 1, // create_account
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 2, // read_account
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 3, // update_account
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 4, // delete_account
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 5, // create_currency
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 6, // update_currency
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 7, // delete_currency
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 8, // delete_user
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 9, // restore_user
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 10, // read_transaction
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 11, // create_transaction
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 12, // edit_transaction
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 13, // delete_transaction
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("role_permissions", null, {});
  },
};
