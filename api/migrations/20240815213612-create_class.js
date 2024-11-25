'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CLASS', {
      id_class: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      date_class: {
        type: Sequelize.DATE,
        allowNull: false
      },
      time_class: {
        type: Sequelize.TIME,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      max_number_member: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      id_status: {
        type: Sequelize.INTEGER,
        references: {
          model: 'STATUS',
          key: 'id_status'
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
    await queryInterface.dropTable('CLASS');
  }
};
