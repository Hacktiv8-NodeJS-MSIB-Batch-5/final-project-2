const router = require("express").Router();
const controller = require("../controllers/photo.controller")

router.post("/", controller.createPhoto)
router.get("/", controller.getAllPhotos)
router.put("/:photoId", controller.updatePhoto)
router.delete("/:photoId", controller.deletePhoto)

module.exports = router;