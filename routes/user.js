const router = require("express").Router();
const auth = require("../middlewares/auth").verify
const controller = require("../controllers/user.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.put("/:userId", auth, controller.updateUser);
router.delete("/:userId", auth,  controller.deleteUser);

module.exports = router;