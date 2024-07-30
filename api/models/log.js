'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {

    static associate(models) {
      // define association here
    }
  }
  Log.init({
    From: DataTypes.STRING,
    Type: DataTypes.STRING,
    Log: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Log',
    paranoid: true,
    timestamps: true
  });

  return Log;
};