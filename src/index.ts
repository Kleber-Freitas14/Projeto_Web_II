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
import { AppDataSource } from "./data-source.js";
import { verifyToken } from "./middlewares/authMiddleware.js";

// importar biblioteca para conexão externa
import cors from "cors";

// Carregar as variáveis do .env
dotenv.config();

// Criar a aplicação Express
const app = express();

//Criar o midldleware para permitir requição externa
app.use(cors());

// Configurar recebimento de dados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROTAS PÚBLICAS
app.use("/", TesteConnectionController);
app.use("/", AuthController);

// PROTEGER AS DEMAIS ROTAS COM JWT
app.use(verifyToken);

// ROTAS PROTEGIDAS
app.use("/", SituationsController);
app.use("/", ProductCategoriesController);
app.use("/", ProductsController);
app.use("/", ProductSituationsController);
app.use("/", UsersController);

// Iniciar servidor após conectar ao banco de dados
const PORT = process.env.PORT || 8080;

AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com o Banco de Dados realizada com sucesso!");

    app.listen(PORT, () => {
      console.log(
        `Servidor iniciado na porta ${PORT}: http://localhost:${PORT}`,
      );
    });
  })
  .catch((error: unknown) => {
    console.error("Erro ao conectar ao Banco de Dados:", error);
  });
