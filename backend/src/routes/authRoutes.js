const express = require("express");
const { register, login, getUserProfile } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware"); // Middleware para validar el token
const registerValidation = require("../middleware/registerValidation");

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", login);

// 🔹 Nueva ruta para obtener los datos del usuario autenticado
router.get("/me", verifyToken, getUserProfile);

module.exports = router;
