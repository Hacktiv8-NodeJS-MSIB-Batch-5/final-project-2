const router = require("express").Router();
const controller = require("../controllers/socialmedia.controller");

router.post("/", controller.postSocMed);
router.get("/", controller.getSocMed);
router.put("/:socialMediaId", controller.putSocMed);
router.delete("/:socialMediaId", controller.deleteSocMed);

module.exports = router;