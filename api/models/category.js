'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CATEGORY  extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if needed
    }
  }

  CATEGORY.init({
    id_category: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CATEGORY', 
    tableName: 'CATEGORY', 
    timestamps: true,     
    paranoid: true        
  });

  return CATEGORY;
};
