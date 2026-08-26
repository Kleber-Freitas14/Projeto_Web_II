import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Controllers
import AuthController from "./controllers/AuthController.js";
import SituationsController from "./controllers/SituationsController.js";

// Rotas
app.use("/", AuthController);
app.use("/", SituationsController);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}: http://localhost:${PORT}/Situations`);
});