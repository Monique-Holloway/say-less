'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

     let blogs = [];

    for(let i = 0; i < 3; i++) {
      blogs.push({
        user_id: 7,
        image: faker.image.avatar(),
        title: faker.address.city(),
        body: faker.lorem.paragraph(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

      await queryInterface.bulkInsert('Blogs', blogs)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
