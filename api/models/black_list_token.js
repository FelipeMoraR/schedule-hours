'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BLACK_LIST_TOKEN extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BLACK_LIST_TOKEN.init({
    id_token: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'BLACK_LIST_TOKEN', 
    tableName: 'BLACK_LIST_TOKEN', 
    timestamps: true,     
    paranoid: true  
  });
  return BLACK_LIST_TOKEN;
};