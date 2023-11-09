const { Comment, Photo, User } = require("../models")
// const comment = require("../models/comment")

exports.createComment = async(req, res) => {
  // const photoId = req.params.photoId
  const userId = req.user_id
  const {
    comment, PhotoId
  } = req.body

  try {
    const data = await Comment.create({
      comment, PhotoId,
      UserId: userId
    })
    res.status(201).json({
      message: "Comment has been created",
      data
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.getAllComments = async(req, res) => {
  const userId = req.user_id

  try {
    const comments = await Comment.findAll({
      where: {
        UserId: userId
      },
      include:[
        {
          model: Photo,
          as: "Photo",
          attributes: ["id", "title", "caption", "poster_image_url"]
        },
        {
          model: User,
          as: "User",
          attributes: ["id", "username", "profile_image_url", "phone_number"]
        }
      ]
    })
    
    if(comments.length === 0){
      console.log(typeof(userId));
      return res.status(404).json({
        message: "Comments not found"
      })
    }
    console.log(comments.length);
    console.log(comments);
    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.updateComment = async(req, res) => {
  const commentId = req.params.commentId
  const userId = req.user_id
  const { comment } = req.body

  const existingComment = await Comment.findByPk(commentId)

  if(!existingComment){
    return res.status(404).json({
      message: "Comment not found."
    });
  }

  if (existingComment.UserId !== userId) {
    return res.status(403).json({
      message: "You don't have permission to update this comment."
    });
  }

  try {
    const data = await existingComment.update({ comment })
    res.status(200).json({
      message: "Comment has been updated",
      data
    })
  } catch (error) {
    res.status(500).json(error);
  }

}

exports.deleteComment = async(req, res) => {
  const commentId = req.params.commentId
  const userId = req.user_id

  const existingComment = await Comment.findByPk(commentId)

  if(!existingComment){
    return res.status(404).json({
      message: "Comment not found."
    });
  }

  if (existingComment.UserId !== userId) {
    return res.status(403).json({
      message: "You don't have permission to delete this comment."
    });
  }

  try {
    await existingComment.destroy()
    res.status(200).json({
      message: "Your comment has been successfully deleted"
    })
  } catch (error) {
    res.status(500).json({
      error: "An error occured while deleting the comment",
      message: error.message,
    })
  }
}