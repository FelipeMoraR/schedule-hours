'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class USER extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      USER.belongsTo(models.TYPEUSER, { foreignKey: 'roleId' });
    }
  }
  USER.init({
    id_user: {
      type: DataTypes.INTEGER,  
      primaryKey: true,         
      autoIncrement: true,     
      allowNull: false          
    },
    username: DataTypes.STRING(50),
    password: DataTypes.STRING(50),
    first_name: DataTypes.STRING(100),
    last_name: DataTypes.STRING(100),
    second_last_name: DataTypes.STRING(100),
    run: DataTypes.INTEGER,
    run_dv: DataTypes.STRING(1),
    description: {
      type: DataTypes.STRING(500),
      allowNull: true 
    },
    profile_photo: {
      type: DataTypes.STRING(500),
      allowNull: true 
    },
    age: DataTypes.INTEGER,
    id_type_user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'TYPEUSER',
        key: 'id_type_user'
      }
    }
  }, {
    sequelize,
    modelName: 'USER',
    tableName: 'USER',  
    paranoid: true,
    timestamps: true
  });
  return USER;
};