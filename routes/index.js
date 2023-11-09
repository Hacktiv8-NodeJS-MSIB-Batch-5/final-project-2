const router = require("express").Router();
const auth = require("../middlewares/auth").verify
const userRoutes = require("../routes/user");
const photoRoutes = require("../routes/photo")
const commentRoutes = require("../routes/comment")
const socialMediaRoutes = require("../routes/socialmedia");

router.use("/users", userRoutes);
router.use("/photos", auth, photoRoutes);
router.use("/comments", auth, commentRoutes)
router.use("/socialmedias", auth, socialMediaRoutes);

module.exports = router;