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
      res.status(500).json({error: "An error occured while attempting to log in", name: e.name, message: ret || e.message});
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
