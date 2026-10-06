import express from "express";
import dotenv from "dotenv";
dotenv.config();
//Criar a aplicação express
const app = express();
// Criar um middleware para receber os dados no corpo da requisição
app.use(express.json());
// Incluir os Controllers
import AuthController from "./controllers/AuthController.js";
import SituationsController from "./controllers/SituationsController.js";
import ProductCategoriesController from "./controllers/ProductCategoriesController.js";
import ProductsController from "./controllers/ProductsController.js";
import ProductSituationsController from "./controllers/ProductSituationsController.js";
import UsersController from "./controllers/UsersController.js";
// Criar as Rotas
app.use("/", AuthController);
app.use("/", SituationsController);
app.use("/", ProductCategoriesController);
app.use("/", ProductsController);
app.use("/", ProductSituationsController);
app.use("/", UsersController);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}: http://localhost:${PORT}/Situations`);
});
//# sourceMappingURL=index.js.map