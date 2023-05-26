'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('keys', 'comment', Sequelize.STRING);
    await queryInterface.removeColumn('users', 'chatId');
    await queryInterface.addIndex('keys', ['token']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('keys', 'comment');
    await queryInterface.addColumn('users', 'chatId', Sequelize.BIGINT);
    await queryInterface.removeIndex('keys', 'token');
  },
};
