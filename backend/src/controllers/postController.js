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
            category, title, description, price, imageUrl,
            year, km, model, fuelType, doors, version, transmission, color, bodyType 
        } = req.body;
        
        const userId = req.user.id;

        const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : imageUrl;

        if (!finalImageUrl) {
            return res.status(400).json({ message: "Debes proporcionar una imagen o una URL." });
        }

        if (
            !title || !description || !price || !category ||
            !year || !km || !model || !fuelType || !doors ||
            !version || !transmission || !color || !bodyType
        ) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        const newPost = await postModel.createPost(
            userId, category, title, description, price, finalImageUrl,
            year, km, model, fuelType, doors, version, transmission, color, bodyType
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
        category,
        year,
        km,
        model,
        fuelType,
        doors,
        version,
        transmission,
        color,
        imageUrl
      } = req.body;
  
      const userId = req.user.id;
  
      console.log("Datos recibidos en el backend:", req.body);
  
      if (
        !title ||
        !description ||
        !price ||
        !category ||
        !year ||
        !km ||
        !model ||
        !fuelType ||
        !doors ||
        !version ||
        !transmission ||
        !color
      ) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }
  
      const updatedPost = await postModel.updatePost(
        id,
        userId,
        title,
        description,
        price,
        category,
        imageUrl,
        year,
        km,
        model,
        fuelType,
        doors,
        version,
        transmission,
        color
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
