'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CLASS_CATEGORY', {
      id_class_category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_category: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CATEGORY',
          key: 'id_category'
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
    await queryInterface.dropTable('CLASS_CATEGORY');
  }
};
