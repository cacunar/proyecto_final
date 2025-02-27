require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/routes");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

module.exports = app;
