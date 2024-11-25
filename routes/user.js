const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/profile", auth.authMiddleware, user.getUser);
router.get("/profile/:id", auth.authMiddleware, user.getUserById);
router.patch("/profile", auth.authMiddleware, user.updateUser);

module.exports = router;