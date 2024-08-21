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
      USER.belongsTo(models.TYPEUSER, { foreignKey: 'id_type_user' });
    }
  }
  USER.init({
    id_user: {
      type: DataTypes.INTEGER,  
      primaryKey: true,         
      autoIncrement: true,     
      allowNull: false          
    },
    username: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    second_last_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    run: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    run_dv: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(200),
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