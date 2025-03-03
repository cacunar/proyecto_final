require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/routes");

app.use(cors({
    origin: [
        "http://localhost:3001",
        "https://proyecto-final-sva5.onrender.com"
      ],
    credentials: true
}
));
app.use(express.json());

app.use("/api/v1", routes);

if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
}

module.exports = app;
