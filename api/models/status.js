"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class STATUS extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  STATUS.init(
    {
      id_status: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
    },
    {
      sequelize,
      modelName: 'STATUS',
      modelName: 'STATUS'
    }
  );
  return STATUS;
};
