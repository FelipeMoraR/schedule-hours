"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TYPEUSER extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TYPEUSER.init(
    {
      id_type_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
      
    },
    {
      sequelize,
      modelName: "TYPEUSER",
      tableName: "TYPEUSER",
      paranoid: true,
      timestamps: true,
    }
  );
  return TYPEUSER;
};
