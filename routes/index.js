const router = require("express").Router();
const auth = require("../middlewares/auth").verify;
const userRoutes = require("../routes/user");
// const photoRoutes = require("../routes/photo")
const socialMediaRoutes = require("../routes/socialmedia");

router.use("/users", userRoutes);
router.use("/socialmedias", auth, socialMediaRoutes);
// router.use("/photos", auth, photoRoutes);

module.exports = router;