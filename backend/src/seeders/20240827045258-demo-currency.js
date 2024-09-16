"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("currencies", [
      {
        name: "United States Dollar",
        code: "USD",
        symbol: "$",
        decimal_places: 2,
        symbol_position: "before",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Euro",
        code: "EUR",
        symbol: "€",
        decimal_places: 2,
        symbol_position: "before", // or "after" depending on preference
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Japanese Yen",
        code: "JPY",
        symbol: "¥",
        decimal_places: 0,
        symbol_position: "before",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "British Pound Sterling",
        code: "GBP",
        symbol: "£",
        decimal_places: 2,
        symbol_position: "before",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Australian Dollar",
        code: "AUD",
        symbol: "A$",
        decimal_places: 2,
        symbol_position: "before",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Myanmar Kyat",
        code: "MMK",
        symbol: "Ks",
        decimal_places: 0,
        symbol_position: "after",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("currencies", null, {});
  },
};
