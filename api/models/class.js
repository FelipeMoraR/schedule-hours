'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CLASS extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */staticassociate(models) {
      // Define associations here// Example: this.belongsTo(models.Status, { foreignKey: 'id_status' });
    }
  }

  CLASS.init({
    id_class: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    max_number_member: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id_status: {
      type: DataTypes.INTEGER,
      references: {
        model: 'STATUS',  // Table name for the referencekey: 'id_status'
        key: 'id_status' 
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'CLASS',
    tableName: 'CLASS', // Use the exact table nametimestamps: true,   // Automatically handles `createdAt` and `updatedAt`paranoid: true// Enable soft deletes with `deletedAt`
  });

  return CLASS;
};
