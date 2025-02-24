const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    try {
        const tokenWithoutBearer = token.replace("Bearer ", ""); 
        const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
}

module.exports = verifyToken;
