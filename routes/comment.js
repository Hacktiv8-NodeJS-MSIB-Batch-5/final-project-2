const router = require("express").Router();
const controller = require("../controllers/comment.controller")

router.post("/", controller.createComment)
router.get("/", controller.getAllComments)
router.put("/:commentId", controller.updateComment)
router.delete("/:commentId", controller.deleteComment)

module.exports = router;