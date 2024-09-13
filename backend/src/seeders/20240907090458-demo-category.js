"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("categories", [
      {
        name: "Sales",
        description: "Income from selling products or services",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Rent",
        description: "Payments for renting properties",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Car Purchase",
        description: "Expenses related to buying new or used cars",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Car Sale",
        description: "Income from selling cars",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Clothes Purchase",
        description: "Expenses related to buying clothes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Advertising",
        description: "Costs related to advertising and promotions",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Office Supplies",
        description: "Costs for purchasing office supplies",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Utilities",
        description:
          "Expenses for utilities like electricity, water, and internet",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Refunds",
        description: "Money returned to customers",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
