"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Photo, {
        foreignKey: "UserId",
        as: "Photo",
      });
      this.hasMany(models.Comment, {
        foreignKey: "UserId",
        as: "Comments",
      });
      this.hasMany(models.SocialMedia, {
        foreignKey: "UserId",
        as: "SocialMedias",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: "Must be a valid email",
          },
          notEmpty: {
            args: true,
            msg: "Email is required"
          },
          notNull: {
            args: true,
            msg: "email is required"
          },
        },
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Full Name is required"
          },
          notNull: {
            args: true,
            msg: "full_name is required"
          },
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Username is required"
          },
          notNull: {
            args: true,
            msg: "username is required"
          },
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password is required"
          },
          notNull: {
            args: true,
            msg: "password is required"
          },
        }
      },
      profile_image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isUrl: {
            msg: "Profile Image URL must be a valid URL",
          },
          notEmpty: {
            args: true,
            msg: "Profile Image URL is required"
          },
          notNull: {
            args: true,
            msg: "profile_image_url is required"
          },
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: {
            msg: "Age must be a valid integer",
          },
          notEmpty: {
            args: true,
            msg: "Age is required"
          },
          notNull: {
            args: true,
            msg: "age is required"
          },
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: {
            msg: "Must be a valid phone number",
          },
          notEmpty: {
            args: true,
            msg: "Phone Number is required"
          },
          notNull: {
            args: true,
            msg: "phone_number is required"
          },
        },
      },
    },
    
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: (user) => {
          const hashedPassword = hashPassword(user.password);
          user.password = hashedPassword;
        }
      }
    }
  );
  return User;
};
