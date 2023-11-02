'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
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
      this.belongsTo(models.Photo, {
        foreignKey: "PhotoId",
        as: "Photo",
      });
    }
  }
  Comment.init({
    UserId: DataTypes.INTEGER,
    PhotoId: DataTypes.INTEGER,
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Comment is required"
        },
        notNull: {
          msg: "comment is required"
        },
      }
    },
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};