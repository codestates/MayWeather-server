"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('location', [{
     *   location: 'seoul',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(

      "locations",

      [
        {
          location: "seoul",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          location: "incheon",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          location: "deagu",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          location: "gwangju",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          location: "busan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('location', null, {});
     */
    await queryInterface.bulkDelete("locations", null, {});
  },
};
