import express from "express";
import dotenv from "dotenv";
// Incluir os Controllers
import AuthController from "./controllers/AuthController.js";
import SituationsController from "./controllers/SituationsController.js";
import ProductCategoriesController from "./controllers/ProductCategoriesController.js";
import ProductsController from "./controllers/ProductsController.js";
import ProductSituationsController from "./controllers/ProductSituationsController.js";
import UsersController from "./controllers/UsersController.js";
dotenv.config();
// Criar a aplicação Express
const app = express();
// Configurar recebimento de dados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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