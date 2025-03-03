const express = require("express");
const { 
    getAllPosts, 
    getUserPosts, 
    getPostById, 
    createPost,
    getImage, 
    updatePost, 
    deletePost 
} = require("../controllers/postController");
const verifyToken = require("../middleware/authMiddleware");
const postValidation = require("../middleware/postValidation");
const multer = require("multer");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllPosts);
router.get("/mis-publicaciones", verifyToken, getUserPosts);
router.get("/:id/image", getImage); 
router.get("/:id", getPostById);
router.post("/create", verifyToken, upload.single("image"), postValidation, createPost);
router.put("/:id", verifyToken, upload.single("image"), postValidation, updatePost);
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
