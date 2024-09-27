'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class REFRESH_TOKEN extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.USER, { foreignKey: 'id_user'});
    }
  }
  REFRESH_TOKEN.init({
    id_refresh_token: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'USER', // Table name for the reference
        key: 'id_user'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    refresh_token: {
      type: DataTypes.STRING(300),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'REFRESH_TOKEN',
    timestamps: true,       
    paranoid: true
  });
  return REFRESH_TOKEN;
};