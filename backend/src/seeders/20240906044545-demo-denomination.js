"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("denominations", [
      // Denominations for US Dollars (USD)
      {
        currency_id: 1, // Assuming USD has id 1, adjust if necessary
        value: 0.01,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 1,
        value: 0.05,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 1,
        value: 0.1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 1,
        value: 0.25,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 1,
        value: 1.0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 1,
        value: 5.0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 1,
        value: 10.0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 1,
        value: 20.0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 1,
        value: 50.0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 1,
        value: 100.0,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Denominations for Myanmar Kyat (MMK)
      {
        currency_id: 6,
        value: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 6,
        value: 100,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 6,
        value: 500,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 6,
        value: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 6,
        value: 5000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        currency_id: 6,
        value: 10000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("denominations", null, {});
  },
};
