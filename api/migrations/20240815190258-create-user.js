'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('USER', {
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      second_last_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      run: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      run_dv: {
        type: Sequelize.STRING(1),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      profile_photo: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_type_user: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TYPEUSER',
          key: 'id_type_user'
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
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('USER');
  }
};
