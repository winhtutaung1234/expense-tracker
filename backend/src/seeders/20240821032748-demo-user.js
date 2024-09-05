"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("users", [
      {
        role_id: 2,
        name: "Alice",
        email: "alice@gmail.com",
        phone_number: "3423423",
        password: await bcrypt.hash("password", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        name: "Bob",
        email: "bob@gmail.com",
        phone_number: "2343432",
        password: await bcrypt.hash("password", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        name: "Kyaw Gyi",
        email: "kyaw@gmail.com",
        password: await bcrypt.hash("password", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
