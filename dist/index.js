// Importar a biblioteca Express
import express from "express";
// Importar variáveis de ambiente
import dotenv from "dotenv";
// Carregando as variáveis do .env
dotenv.config();
// Criar a aplicação Express
const app = express();
//Incluir os Controllers
import login from "./controllers/login.js";
//Criar as rota
app.use('/', login);
// Iniciar o servidor na porta 8080
app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:{process.env.PORT`);
});
//# sourceMappingURL=index.js.map