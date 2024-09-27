'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('REFRESH_TOKEN', {
      id_refresh_token: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_user:{
        type: Sequelize.INTEGER,
        references: {
          model: 'USER', // Table name for the reference
          key: 'id_user'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      refresh_token: {
        type: Sequelize.STRING(300),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
        
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('REFRESH_TOKEN');
  }
};