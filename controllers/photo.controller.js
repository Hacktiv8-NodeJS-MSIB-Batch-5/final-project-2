const { Photo, Comment, User } = require("../models");
// const photo = require("../models/photo");

exports.createPhoto = async (req, res) => {
  const userId = req.user_id
  const {
      title, caption,
      poster_image_url,
  } = req.body;

  try {
    const data = await Photo.create({
      title, caption,
      poster_image_url,
      UserId: userId
  })
  res.status(201).json({
    message: "Photo  has been created",
    data: {
      id: data.id,
      poster_image_url: data.poster_image_url,
      title: data.title,
      caption: data.caption,
      UserId: data.UserId
      // Add other columns you want to include
    }
  })
  }catch (error) {
    res.status(500).json(error)
  }
}

exports.getAllPhotos = async(req, res) => {
  try {
    const existingPhotos = await Photo.findAll({
      // include: Comment
      include: [
        {
          model: Comment,
          as: "Comments",
          attributes: ["comment"],
          include: [{
            model: User,
            as: "User",
            attributes:["username"]
          }]
        },
        {
          model: User,
          as: "User",
          attributes:["id", "username", "profile_image_url"]
        }
    ]
    })

    if (existingPhotos.length === 0) {
    return res.status(404).json({
      message: "There are no photo(s)."
    });
  }

    // console.log(data);
    res.status(200).json(existingPhotos)
  }catch (error) {
    res.status(500).json(error)
  }
}

exports.updatePhoto = async(req, res) => {
  const photoId = req.params.photoId
  const userId = req.user_id
  const {
    title, caption,
    poster_image_url
  } = req.body

  const existingPhoto = await Photo.findByPk(photoId)

  if (!existingPhoto) {
    return res.status(404).json({
      message: "Photo not found."
    });
  }

  if (existingPhoto.UserId !== userId) {
    return res.status(403).json({
      message: "You don't have permission to update this photo."
    });
  }

  try {
    const photo = await existingPhoto.update({
      title,
      caption,
      poster_image_url
    });

    res.status(200).json({
      message: "Photo has been updated",
      photo
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.deletePhoto = async(req, res) => {
  const photoId = req.params.photoId
  const userId = req.user_id

  const existingPhoto = await Photo.findByPk(photoId)

  if (!existingPhoto) {
    // console.log(photoId);
    // console.log(userId);
    return res.status(404).json({
      message: "Photo not found."
    });
  }

  if (existingPhoto.UserId !== userId) {
    return res.status(403).json({
      message: "You don't have permission to delete this photo."
    });
  }

  try {
    await existingPhoto.destroy()
    res.status(200).json({
      message: "Your Photo has been successfully deleted"
    })
  } catch (error) {
    res.status(500).json({
      error: "An error occured while deleting the photo",
      message: error.message,
    })
  }
}