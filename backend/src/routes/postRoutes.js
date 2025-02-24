const express = require("express");
const { 
    getAllPosts, 
    getUserPosts, 
    getPostById, 
    createPost, 
    updatePost, 
    deletePost 
} = require("../controllers/postController");
const verifyToken = require("../middleware/authMiddleware");
const postValidation = require("../middleware/postValidation");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// 🔹 Obtener todas las publicaciones (públicas)
router.get("/", getAllPosts);

// 🔹 Obtener publicaciones del usuario autenticado (Mis Publicaciones)
router.get("/mis-publicaciones", verifyToken, getUserPosts);

// 🔹 Obtener una publicación por ID
router.get("/:id", getPostById);

// 🔹 Crear una nueva publicación (requiere autenticación y validaciones)
router.post("/create", verifyToken, upload.single("image"), postValidation, createPost);

// 🔹 Actualizar una publicación (requiere autenticación y validaciones)
router.put("/:id", verifyToken, postValidation, updatePost);

// 🔹 Eliminar una publicación (requiere autenticación)
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
