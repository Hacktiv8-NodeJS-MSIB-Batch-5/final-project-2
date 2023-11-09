const router = require("express").Router();
const auth = require("../middlewares/auth").verify
const userRoutes = require("../routes/user");
const photoRoutes = require("../routes/photo")
const commentRoutes = require("../routes/comment")

router.use("/users", userRoutes);
router.use("/photos", auth, photoRoutes);
router.use("/comments", auth, commentRoutes)

module.exports = router;