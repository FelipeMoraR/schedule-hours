'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class STATUS_CLASS_USER extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  STATUS_CLASS_USER.init({
    id_status_class_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'STATUS_CLASS_USER',
    tableName: "STATUS_CLASS_USER",
    paranoid: true,
    timestamps: true,
  });
  return STATUS_CLASS_USER;
};