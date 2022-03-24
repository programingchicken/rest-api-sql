'use strict';

const { DataTypes, Model } = require('sequelize');

const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model { };
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'You need a first name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'You need a last name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notNull: {
          msg: 'You need a email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if (val !== "") {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword);
        }
      },
      validate: {
        notNull: {
          msg: 'You need a Password'
        }
      }
    }
  },
    {
      sequelize,
      modelName: 'User',
    });


  User.associate = (models) => {
    // define association here
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'UserId',
        allowNull: false,
      },
    });
  };
  return User
}