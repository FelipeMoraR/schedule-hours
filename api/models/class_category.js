'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ClassCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.Category, { foreignKey: 'id_category' });
      this.belongsTo(models.Class, { foreignKey: 'id_class' });
    }
  }

  ClassCategory.init({
    id_class_category: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    id_category: {
      type: DataTypes.INTEGER,
      references: {
        model: 'CATEGORY', // Table name for the reference
        key: 'id_category'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    id_class: {
      type: DataTypes.INTEGER,
      references: {
        model: 'CLASS', // Table name for the reference
        key: 'id_class'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'ClassCategory', 
    tableName: 'CLASS_CATEGORY', 
    timestamps: true,       
    paranoid: true          
  });

  return ClassCategory;
};
