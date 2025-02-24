const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// 🔹 Registro de usuario
const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // 📌 Verificar si el usuario ya existe
        const existingUser = await userModel.getUserByEmail(req.body.email);
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // 📌 Crear el usuario
        const newUser = await userModel.createUser(req.body);
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ user: newUser, token });

    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// 🔹 Inicio de sesión (Login)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // 📌 Comparar la contraseña ingresada con la almacenada en la base de datos
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // 📌 Generar el token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email }, 
            token
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// 🔹 Obtener perfil del usuario autenticado
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error obteniendo perfil:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

module.exports = { register, login, getUserProfile };
