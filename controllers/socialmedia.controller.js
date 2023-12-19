const { SocialMedia, User } = require("../models");

exports.postSocMed = async (req, res) => {
  try {
    const userId = req.user_id;
    const {
      name,
      social_media_url
    } = req.body
    
    const socMed = await SocialMedia.create({
      name: name,
      social_media_url: social_media_url,
      UserId: userId,
    })
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
  } catch (e) {
    const ret = {};
    e?.errors?.map( er => {
      ret[er.path] = er.message;
    })
    res.status(500).json({
      error: "An error occured while attempting to Post Social Media",
      name: e.name,
      message: Object.keys(ret).length ? ret : e.message
    }); 
  }
}

exports.getSocMed = async (req, res) => {
  try {
    const userId = req.user_id;
    const socMed = await SocialMedia.findAll({
      where: {
        UserId: userId
      },
      include: [{
        model: User,
        as: "User",
        attributes: ["id", "username", "profile_image_url"],
      }]
    })
    res.status(200).json({
      social_medias: socMed
    })
    
  } catch (e) {
    const ret = {};
    e?.errors?.map( er => {
      ret[er.path] = er.message;
    })
    res.status(500).json({
      error: "An error occured while attempting to Get Social Media",
      name: e.name,
      message: Object.keys(ret).length ? ret : e.message
    });
  }
}

exports.putSocMed = async (req, res) => {
  try {
    const userId = req.user_id;
    const socialMediaId = Number(req.params.socialMediaId);
    const {
      name,
      social_media_url
    } = req.body;

    const data = await SocialMedia.findByPk(socialMediaId)
    if (!data){
      throw {
        code: 404,
        message: "Social Media data not found"
      }
    }
    const isAuthorized = data.UserId === Number(userId);
    if (! isAuthorized){
      throw{
        code: 403,
        message: "You are not authorized to perform this action"
      }
    }
    
    const updateData = await SocialMedia.update({
      name,
      social_media_url
    },{
      where: {
        id: socialMediaId,
        UserId: userId
      },
      returning: true
    })
    
    const social_media = updateData[1][0];
    const updatedSocMed = {
      id: social_media.id,
      name: social_media.name,
      social_media_url: social_media.social_media_url,
      UserId: social_media.UserId,
      updatedAt: social_media.updatedAt,
      createdAt: social_media.createdAt
    }

    res.status(200).json({
      social_media: updatedSocMed
    })
  } catch (e) {
    const ret = new Object;
    e?.errors?.map( er => {
      ret[er.path] = er.message;
    })
    res.status(e?.code || 500).json({
      error: "An error occured while attempting to Put Social Media",
      name: e.name,
      message: Object.keys(ret).length ? ret : e.message
    });
  }  
}

exports.deleteSocMed = async (req, res) => {
  try {
    const userId = req.user_id;
    const socialMediaId = Number(req.params.socialMediaId);
    const {
      name, 
      social_media_url
    } = req.body
    
    const data = await SocialMedia.findByPk(socialMediaId)
    if (!data){
      throw {
        code: 404,
        message: "Social Media data not found"
      }
    }
    const isAuthorized = data.UserId === Number(userId);
    if (! isAuthorized){
      throw{
        code: 403,
        message: "You are not authorized to perform this action"
      }
    }
    const socMed = await SocialMedia.destroy({
      where: {
        id: socialMediaId,
        UserId: userId
      }
    })
    res.status(200).json({
      message: "Your social media has been successfully deleted"
    })
  } catch (e) {
    const ret = new Object;
    e?.errors?.map( er => {
      ret[er.path] = er.message;
    })
    res.status(e?.code || 500).json({
      error: "An error occured while attempting to Put Social Media",
      name: e.name,
      message: Object.keys(ret).length ? ret : e.message
    });
  }
}