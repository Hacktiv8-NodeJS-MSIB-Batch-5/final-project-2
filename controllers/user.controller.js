const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../middlewares/auth");

exports.register = async (req, res) => {
  const body = req.body;
  const email = body.email;
  const full_name = body.full_name;
  const username = body.username;
  const password = body.password;
  const profile_image_url = body.profile_image_url;
  const age = body.age;
  const phone_number = body.phone_number;
  await User.create({
    full_name: full_name,
    email: email,
    username: username,
    password: password,
    profile_image_url: profile_image_url,
    age: age,
    phone_number: phone_number,
  })
    .then((user) => {
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
    })
    .catch((e) => {
      const ret = {};
      try{
        // log all errors on sequelize schema constraint & validation 
        e.errors.map( er => {
          ret[er.path] = er.message;
        })
      } catch(e) {}
      res.status(500).json({error: "An error occured while attempting to register", name: e.name, message: ret || e.message});
    })
};

exports.login = async (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  await User.findOne({
    where: {
      email,
    },
  })
    .then((user) => {
      if (!user){
        return res.status(400).json({
          message: `Cannot find user with email '${email}'`,
        });
      }
      if (!password){
        return res.status(401).json({message: "Password not provided!"});
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
        res.status(401).json({message: "Wrong password!"});
      }
    })
    .catch((e) => {
      try{
        // log all errors on sequelize schema constraint & validation
        const ret = {};
        e.errors.map( er => {
          ret[er.path] = er.message;
        })
      } catch(e) {}
      res.status(500).json({error: "An error occured while attempting to log in", name: e.name, message: e.message || ret});
    })
};

exports.updateUser = async(req, res) => {
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
    return res.status(404).json({message: "User not found"})
  }

  if (requestUserId !== userId) {
    // console.log(typeof(requestUserId));
    // console.log(typeof(userId));
    return res.status(403).json({
      message: "You are not authorized to perform this action"
    });
  }

  try {
    await User.update(
      { email, full_name, username, profile_image_url, age, phone_number },
      { where: { id: userId } }
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
  } catch (error) {
    res.status(500).json({
      error: "An error occured while updating the user",
      message: error.message,
    })
  }
}

exports.deleteUser = async(req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const requestUserId = req.user_id;

  const user = await User.findByPk(userId);
  if(!user){
    return res.status(404).json({message: "User not found"})
  }

  if (requestUserId !== userId) {
    return res.status(403).json({
      message: "You are not authorized to perform this action"
    });
  }

  try {
    await user.destroy();
    res.status(200).json({message: "Your account has been successfully deleted"})
  } catch (error) {
    res.status(500).json({
      error: "An error occured while deleting the user",
      message: error.message,
    })
  }
}