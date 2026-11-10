
import express from "express";
import dotenv from "dotenv";

// Incluir os Controllers
import TesteConnectionController from "./controllers/TesteConnectionController.js";
import AuthController from "./controllers/AuthController.js";
import UsersController from "./controllers/UsersController.js";
import SituationsController from "./controllers/SituationsController.js";
import ProductCategoriesController from "./controllers/ProductCategoriesController.js";
import ProductsController from "./controllers/ProductsController.js";
import ProductSituationsController from "./controllers/ProductSituationsController.js";


// importar biblioteca para conexão externa
import cors from 'cors';

// Carregar as variáveis do .env
dotenv.config();

// Criar a aplicação Express
const app = express();
console.log(">>> INDEX.TS ATUAL ESTÁ SENDO EXECUTADO <<<");

//Criar o midldleware para permitir requição externa
app.use(cors());


// Configurar recebimento de dados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DIAGNÓSTICO TEMPORÁRIO
app.use((req, res, next) => {
    console.log("========== REQUISIÇÃO ==========");
    console.log("URL:", req.url);
    console.log("MÉTODO:", req.method);
    console.log("CONTENT-TYPE:", req.headers["content-type"]);
    console.log("BODY:", req.body);
    console.log("================================");

    next();
});

// Criar as Rotas
app.use("/", TesteConnectionController);
app.use("/", AuthController);
app.use("/", SituationsController);
app.use("/", ProductCategoriesController);
app.use("/", ProductsController);
app.use("/", ProductSituationsController);
app.use("/", UsersController);

// Iniciar servidor
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}: http://localhost:${PORT}/Situations`);
});
