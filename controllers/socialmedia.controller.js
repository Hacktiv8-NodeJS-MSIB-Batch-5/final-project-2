const { SocialMedia, User } = require("../models");

exports.postSocMed = async (req, res) => {
  const body = req.body;
  const name = body.name;
  const url = body.social_media_url;
  const userId = req.user_id;
  
  await SocialMedia.create({
    name: name,
    social_media_url: url,
    UserId: userId,
  })
    .then((createdSocMed) => {
      res.status(201).json({
        socialmedia: createdSocMed
      })
    })
    .catch((e) => {
      const ret = {};
      try{
        // log all errors on sequelize schema constraint & validation 
        e.errors.map( er => {
          ret[er.path] = er.message;
        })
      } catch(e) {}
      res.status(500).json({
        error: "An error occured while attempting to Post Social Media",
        name: e.name,
        message: ret || e.message
      });
    })
}

exports.getSocMed = async (req, res) => {
  const userId = req.user_id;
  
  await SocialMedia.findAll({
    where: {
      UserId: userId
    },
    // include: {
    //   User
    // }
  })
    .then((socMed) => {
      console.log(socMed);
      res.status(200).json({
        social_medias: socMed
      })
    })
    .catch((e) => {
      const ret = {};
      try{
        // log all errors on sequelize schema constraint & validation 
        e.errors.map( er => {
          ret[er.path] = er.message;
        })
      } catch(e) {}
      res.status(500).json({
        error: "An error occured while attempting to Get Social Media",
        name: e.name,
        message: ret || e.message
      });
    })
}

exports.putSocMed = async (req, res) => {
  
}

exports.deleteSocMed = async (req, res) => {

}