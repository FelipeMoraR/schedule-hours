'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class HistoryClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.User, { foreignKey: 'id_user' });
      this.belongsTo(models.Class, { foreignKey: 'id_class' });
    }
  }

  HistoryClass.init({
    id_history_class: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    event: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    date_save: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'USER',
        key: 'id_user'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    id_class: {
      type: DataTypes.INTEGER,
      references: {
        model: 'CLASS', 
        key: 'id_class'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'HistoryClass', 
    tableName: 'HISTORY_CLASS', 
    timestamps: true,       
    paranoid: true          
  });

  return HistoryClass;
};