const router = require("express").Router();
// const auth = require("../middlewares/auth").verify
const userRoutes = require("../routes/user");
// const photoRoutes = require("../routes/photo")

router.use("/users", userRoutes);
// router.use("/photos", auth, photoRoutes);

module.exports = router;