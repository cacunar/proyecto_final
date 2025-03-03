const { validationResult } = require("express-validator");
const postModel = require("../models/postModel");

exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.user.id; 
        const posts = await postModel.getUserPosts(userId);

        if (posts.length === 0) {
            return res.status(404).json({ message: "No tienes publicaciones creadas." });
        }

        res.json(posts);
    } catch (error) {
        console.error("Error obteniendo publicaciones del usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

exports.getImage = async (req, res) => {
    try {
      const { id } = req.params;  
      const imageBuffer = await postModel.getImageData(id);
      if (!imageBuffer) {
        return res.status(404).json({ message: "No existe la publicación o no tiene imagen." });
      }  
      res.set("Content-Type", "image/jpeg");
      res.send(imageBuffer);
    } catch (error) {
      console.error("Error obteniendo imagen:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  

exports.getAllPosts = async (req, res) => {
    try {
        const { search } = req.query; 
        const posts = await postModel.getAllPosts(search);
        res.json(posts);
    } catch (error) {
        console.error("Error obteniendo publicaciones:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postModel.getPostById(id);

        if (!post) return res.status(404).json({ message: "Publicación no encontrada" });

        res.json(post);
    } catch (error) {
        console.error("Error obteniendo publicación:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

exports.createPost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { 
            title, 
            description, 
            price,
            year, 
            km, 
            model, 
            fuelType, 
            doors, 
            version, 
            transmission, 
            color, 
            bodyType 
        } = req.body;
        
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: "Debes subir una imagen" });
        }

        const imageBuffer = req.file.buffer;

        if (
            !title || 
            !description || 
            !price ||
            !year || 
            !km || 
            !model || 
            !fuelType || 
            !doors ||
            !version || 
            !transmission || 
            !color || 
            !bodyType
        ) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        const newPost = await postModel.createPost(
            userId, 
            title, 
            description, 
            price,
            year, 
            km, 
            model, 
            fuelType, 
            doors, 
            version, 
            transmission, 
            color,
            bodyType,
            imageBuffer
        );

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creando publicación:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};


exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            price,
            year,
            km,
            model,
            fuelType,
            doors,
            version,
            transmission,
            color,
            bodyType
        } = req.body;

        const userId = req.user.id;
        let imageBuffer = null;

        console.log("Datos recibidos en el backend:", req.body);

        if (req.file) {
            imageBuffer = req.file.buffer;
        } else {
            const existingPost = await postModel.getImageData(id);
            if (!existingPost) {
                return res.status(404).json({ message: "Publicación no encontrada." });
            }
            imageBuffer = existingPost;
        }

        if (
            !title || !description || !price ||
            !year || !km || !model || !fuelType || !doors ||
            !version || !transmission || !color || !bodyType
        ) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        const updatedPost = await postModel.updatePost(
            id,
            userId,
            title,
            description,
            price,
            year,
            km,
            model,
            fuelType,
            doors,
            version,
            transmission,
            color,
            bodyType,
            imageBuffer 
        );

        if (!updatedPost) {
            return res.status(403).json({ message: "No tienes permisos para actualizar esta publicación" });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error("Error actualizando publicación:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

  
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deletedPost = await postModel.deletePost(id, userId);

        if (!deletedPost) {
            return res.status(403).json({ message: "No tienes permisos para eliminar esta publicación" });
        }

        res.status(200).json({ message: "Publicación eliminada correctamente" });
    } catch (error) {
        console.error("Error eliminando publicación:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
