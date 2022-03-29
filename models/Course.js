'use strict';
const Sequelize = require('sequelize')
const { DataTypes, Model } = Sequelize;

module.exports = (sequelize) => {
  class Course extends Model { }
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'You need a title'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'You need a description'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
    {
      sequelize,
      modelName: 'Course'
    });


  Course.associate = (models) => {
    // define association here
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'UserId',
        allowNull: false,
      },
    });
  };
  return Course
}