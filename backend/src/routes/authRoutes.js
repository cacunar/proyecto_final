const express = require("express");
const { register, login, getUserProfile } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const registerValidation = require("../middleware/registerValidation");

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", login);

router.get("/me", verifyToken, getUserProfile);

module.exports = router;
