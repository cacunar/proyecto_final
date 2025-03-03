const { body } = require("express-validator");

const postValidation = [
    body("title")
        .notEmpty().withMessage("El título es obligatorio")
        .isLength({ min: 5 }).withMessage("El título debe tener al menos 5 caracteres"),

    body("description")
        .notEmpty().withMessage("La descripción es obligatoria")
        .isLength({ min: 10 }).withMessage("La descripción debe tener al menos 10 caracteres"),

    body("price")
        .notEmpty().withMessage("El precio es obligatorio")
        .isNumeric().withMessage("El precio debe ser un número válido")
        .custom((value) => value > 0).withMessage("El precio debe ser mayor a 0"),

    body("bodyType")
        .notEmpty().withMessage("La categoría es obligatoria")
        .isString().withMessage("La categoría debe ser un texto válido"),

    body("year")
        .notEmpty().withMessage("El año es obligatorio")
        .isInt({ min: 1886 }).withMessage("El año debe ser válido (posterior a 1886)"),

    body("km")
        .notEmpty().withMessage("El kilometraje es obligatorio")
        .isInt({ min: 0 }).withMessage("El kilometraje no puede ser negativo"),

    body("model")
        .notEmpty().withMessage("El modelo es obligatorio")
        .isString().withMessage("El modelo debe ser un texto válido"),

    body("fuelType")
        .notEmpty().withMessage("El tipo de combustible es obligatorio")
        .isString().withMessage("Debe ser un texto válido (Gasolina, Diésel, etc.)"),

    body("doors")
        .notEmpty().withMessage("El número de puertas es obligatorio")
        .isInt({ min: 2, max: 6 }).withMessage("Las puertas deben estar entre 2 y 6"),

    body("version")
        .notEmpty().withMessage("La versión es obligatoria")
        .isString().withMessage("Debe ser un texto válido"),

    body("transmission")
        .notEmpty().withMessage("La transmisión es obligatoria")
        .isString().withMessage("Debe ser un texto válido"),

    body("color")
        .notEmpty().withMessage("El color es obligatorio")
        .isString().withMessage("Debe ser un texto válido"),
];

module.exports = postValidation;
