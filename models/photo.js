'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "User",
      });
      this.hasMany(models.Comment, {
        foreignKey: "PhotoId",
        as: "Comments",
      });
    }
  }
  Photo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Title is required"
        },
        notNull: {
          msg: "title is required"
        },
      }
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Caption is required"
        },
        notNull: {
          msg: "caption is required"
        },
      }
    },
    poster_image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: {
          args: true,
          msg: "Poster Image URL must be a valid URL"
        },
        notEmpty: {
          args: true,
          msg: "Poster Image URL is required"
        },
        notNull: {
          msg: "poster_image_url is required"
        },
      }
    },
    UserId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};