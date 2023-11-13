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
    .then((socMed) => {
      const createdSocMed = {
        id: socMed.id,
        name: socMed.name,
        social_media_url: socMed.social_media_url,
        UserId: socMed.UserId,
        updatedAt: socMed.updatedAt,
        createdAt: socMed.createdAt
      }
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
    include: [{
      model: User,
      as: "User",
      attributes: ["id", "username", "profile_image_url"],
    }]
  })
    .then((socMed) => {
      console.log(socMed);
      res.status(200).json({
        social_medias: socMed
      })
    })
    .catch((e) => {
      console.log(e);
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
  const body = req.body;
  const name = body.name;
  const url = body.social_media_url;
  const userId = req.user_id;
  const socialMediaId = Number(req.params.socialMediaId);

  await SocialMedia.findByPk(socialMediaId)
    .then(async (data) => {
      if (!data){
        return res.status(404).json({message: "Social Media data not found"});
      }
      const isAuthorized = data.UserId === Number(userId);
      if (! isAuthorized){
        return res.status(401).json({message: "You are not authorized to perform this action"});
      }

      await SocialMedia.update({
        name,
        social_media_url: url
      },{
        where: {
          id: socialMediaId,
          UserId: userId
        },
        returning: true
      })
        .then((socMed) => {
          const social_media = socMed[1][0];
          const updatedSocMed = {
            id: social_media.id,
            name: social_media.name,
            social_media_url: social_media.social_media_url,
            UserId: social_media.UserId,
            updatedAt: social_media.updatedAt,
            createdAt: social_media.createdAt
          }
          // console.log(social_media);
          res.status(200).json({
            social_media: updatedSocMed
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
            error: "An error occured while attempting to Update Social Media",
            name: e.name,
            message: ret || e.message
          });
        })
    })
    .catch((e) => {
      res.status(500).json({error: "An error occured while attempting to Update Social Media", message: e.message});
    })
}

exports.deleteSocMed = async (req, res) => {
  const body = req.body;
  const name = body.name;
  const url = body.social_media_url;
  const userId = req.user_id;
  const socialMediaId = Number(req.params.socialMediaId);

  await SocialMedia.findByPk(socialMediaId)
    .then(async (data) => {
      if (!data){
        return res.status(404).json({message: "Social Media data not found"});
      }
      const isAuthorized = data.UserId === Number(userId);
      if (! isAuthorized){
        return res.status(401).json({message: "You are not authorized to perform this action"});
      }

      await SocialMedia.destroy({
        where: {
          id: socialMediaId,
          UserId: userId
        }
      })
        .then((socMed) => {
          res.status(200).json({
            message: "Your social media has been successfully deleted"
          })
        })
        .catch((e) => {
          res.status(500).json({
            error: "An error occured while attempting to Delete Social Media",
            name: e.name,
            message: e.message
          });
        })
    })
    .catch((e) => {
      res.status(500).json({error: "An error occured while attempting to Delete Social Media", message: e.message});
    })
}