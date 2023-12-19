const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../middlewares/auth");

exports.register = async (req, res) => {
  try {
    const {
      email,
      full_name,
      username,
      password,
      profile_image_url,
      age,
      phone_number
    } = req.body;

    const user = await User.create({
      full_name: full_name,
      email: email,
      username: username,
      password: password,
      profile_image_url: profile_image_url,
      age: age,
      phone_number: phone_number,
    })

    const token = generateToken({
      full_name: user.full_name,
      email: user.email,
      username: user.username,
      profile_image_url: user.profile_image_url,
      age: user.age,
      phone_number: user.phone_number,
    });

    res.status(201).json({
      user: {
        email: user.email,
        full_name: user.full_name,
        username: user.username,
        profile_image_url: user.profile_image_url,
        age: user.age,
        phone_number: user.phone_number,
      },
    });
    
  } catch (e) {
    const ret = {};
    e?.errors?.map( er => {
      ret[er.path] = er.message;
    })
    res.status(e?.code || 500).json({
      error: "An error occured while attempting to register",
      name: e.name,
      message: Object.keys(ret).length ? ret : e.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    })
  
    if (!user){
      throw{
        code: 400,
        message: `Cannot find user with email '${email}'`,
      }
    }
    if (!password){
      throw{
        code: 401,
        message: "Password not provided!"
      }
    }
    if (comparePassword(password, user.password)){
      let payload = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        profile_image_url: user.profile_image_url,
        age: user.age,
        phone_number: user.phone_number,
      };
      const token = generateToken(payload);
      res.status(200).json({token});
    }
    else{
      throw{
        code: 401,
        message: "Wrong password!"
      }
    }
  } catch (e) {
    const ret = {};
    e?.errors?.map( er => {
      ret[er.path] = er.message;
    })
    res.status(e?.code || 500).json({
      error: "An error occured while attempting to log in",
      name: e.name,
      message: Object.keys(ret).length ? ret : e.message
    });
  }
};

exports.updateUser = async(req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const requestUserId = req.user_id;
    const { 
      email, 
      full_name, 
      username, 
      profile_image_url, 
      age, 
      phone_number 
    } = req.body;
  
    const existingUser = await User.findByPk(userId);
    if(!existingUser){
      throw{
        code: 404,
        message: "User not found"
      }
    }
  
    if (requestUserId !== userId) {
      throw{
        code: 403,
        message: "You are not authorized to perform this action"
      }
    }
    await existingUser.update(
      { email, full_name, username, profile_image_url, age, phone_number },
      // { where: { id: userId } }
    );
    res.status(200).json({
      message: "User Updated Successfully", 
      user: {
        email: existingUser.email,
        full_name: existingUser.full_name,
        username: existingUser.username,
        profile_image_url: existingUser.profile_image_url,
        age: existingUser.age,
        phone_number: existingUser.phone_number,
      },
    })
  } catch (e) {
    res.status(e?.code || 500).json({
      error: "An error occured while updating the user",
      message: e.message,
    })
  }
}

exports.deleteUser = async(req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const requestUserId = req.user_id;
  
    const user = await User.findByPk(userId);
    if(!user){
      throw{
        code: 404,
        message: "User not found"
      }
    }
  
    if (requestUserId !== userId) {
      throw{
        code: 403,
        message: "You are not authorized to perform this action"
      }
    }
    await user.destroy();
    res.status(200).json({message: "Your account has been successfully deleted"})

  } catch (e) {
    res.status(e?.code || 500).json({
      error: "An error occured while deleting the user",
      message: e.message,
    })
  }
}