'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SocialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "User",
      });
    }
  }
  SocialMedia.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Name is required"
        },
        notNull: {
          msg: "name is required"
        },
      }
    },
    social_media_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Social Media URL is required"
        },
        notNull: {
          msg: "social_media_url is required"
        },
      }
    },
    UserId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'SocialMedia',
  });
  return SocialMedia;
};