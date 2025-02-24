const { body } = require("express-validator");

const registerValidation = [
    body("firstName").notEmpty().withMessage("El nombre es obligatorio"),
    body("lastName").notEmpty().withMessage("El apellido es obligatorio"),
    body("country").notEmpty().withMessage("El país es obligatorio"),
    body("document").notEmpty().withMessage("El documento es obligatorio"),
    body("phone").notEmpty().withMessage("El teléfono es obligatorio"),
    body("email").isEmail().withMessage("Debe ser un correo válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("address").notEmpty().withMessage("La dirección es obligatoria"),
    body("zipCode").notEmpty().withMessage("El código postal es obligatorio"),
    body("birthDate").isISO8601().toDate().withMessage("Fecha de nacimiento no válida"),
];

module.exports = registerValidation;
