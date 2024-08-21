'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CLASS_USER extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.USER, { foreignKey: 'id_user' });
      this.belongsTo(models.CLASS, { foreignKey: 'id_class' });
    }
  }

  CLASS_USER.init({
    id_class_user: {
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
    id_class: {
      type: DataTypes.INTEGER,
      references: {
        model: 'CLASS', // Table name for the reference
        key: 'id_class'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'CLASS_USER', 
    tableName: 'CLASS_USER', 
    timestamps: true,       
    paranoid: true     
  });

  return CLASS_USER;
};
