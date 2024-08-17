'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('HISTORY_CLASS', {
      id_history_class: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      event: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      date_save: {
        type: Sequelize.DATE,
        allowNull: false
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: 'USER',
          key: 'id_user'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_class: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CLASS',
          key: 'id_class'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
      
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('HISTORY_CLASS');
  }
};