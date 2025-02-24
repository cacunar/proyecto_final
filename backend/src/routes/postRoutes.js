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

router.get("/", getAllPosts);

router.get("/mis-publicaciones", verifyToken, getUserPosts);

router.get("/:id", getPostById);

router.post("/create", verifyToken, upload.single("image"), postValidation, createPost);

router.put("/:id", verifyToken, postValidation, updatePost);

router.delete("/:id", verifyToken, deletePost);

module.exports = router;
