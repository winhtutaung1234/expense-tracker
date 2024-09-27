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
        text_color: "#FFFFFF",
        background_color: "#4CAF50",
      },
      {
        name: "Rent",
        description: "Payments for renting properties",
        created_at: new Date(),
        updated_at: new Date(),
        text_color: "#FFFFFF",
        background_color: "#FF9800",
      },
      {
        name: "Car Purchase",
        description: "Expenses related to buying new or used cars",
        created_at: new Date(),
        updated_at: new Date(),
        text_color: "#FFFFFF",
        background_color: "#2196F3",
      },
      {
        name: "Car Sale",
        description: "Income from selling cars",
        created_at: new Date(),
        updated_at: new Date(),
        text_color: "#FFFFFF",
        background_color: "#FF5722",
      },
      {
        name: "Clothes Purchase",
        description: "Expenses related to buying clothes",
        created_at: new Date(),
        updated_at: new Date(),
        text_color: "#FFFFFF",
        background_color: "#9C27B0",
      },
      {
        name: "Advertising",
        description: "Costs related to advertising and promotions",
        created_at: new Date(),
        updated_at: new Date(),
        text_color: "#000000",
        background_color: "#FFC107",
      },
      {
        name: "Office Supplies",
        description: "Costs for purchasing office supplies",
        created_at: new Date(),
        updated_at: new Date(),
        text_color: "#FFFFFF",
        background_color: "#607D8B",
      },
      {
        name: "Utilities",
        description:
          "Expenses for utilities like electricity, water, and internet",
        created_at: new Date(),
        updated_at: new Date(),
        text_color: "#FFFFFF",
        background_color: "#3F51B5",
      },
      {
        name: "Refunds",
        description: "Money returned to customers",
        created_at: new Date(),
        updated_at: new Date(),
        text_color: "#FFFFFF",
        background_color: "#F44336",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
