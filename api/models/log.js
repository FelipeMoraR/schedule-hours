'use strict';
const {
  Model
} = require('sequelize');

const { DeletedAt } = require('@sequelize/core/decorators-legacy');

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    @DeletedAt
    deletedAt;
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