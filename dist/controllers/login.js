// Importar a biblioteca Express
import express, {} from "express";
// Importa o arquivo com as credenciais do BD
import { AppDataSource } from "../data-source.js";
// Criar a aplicação Express
const router = express();
// Criando a inicialização da conexão com o BD
AppDataSource.initialize().then(() => {
    console.log("Conexão Com o Banco de Dados Realizado Com Sucesso!");
}).catch((error) => {
    console.log("Erro Na Conexão Com o Bando de Dados!");
});
// Criar a rota GET principal
router.get("/", (req, res) => {
    res.send("Bem-Vindo Pessoal alterado");
});
// Exporta a instrução da rota
export default router;
//# sourceMappingURL=login.js.map