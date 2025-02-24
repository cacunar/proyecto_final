const express = require("express");
const authRoutes = require("./authRoutes");
const postRoutes = require("./postRoutes");

const router = express.Router();

// Rutas
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);

module.exports = router;