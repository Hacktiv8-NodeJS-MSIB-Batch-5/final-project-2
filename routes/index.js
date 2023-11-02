const router = require("express").Router();
const userRoutes = require("../routes/user");

router.use("/users", userRoutes);

module.exports = router;