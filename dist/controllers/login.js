// Importar a biblioteca Express
import express, {} from "express";
// Criar a aplicação Express
const router = express();
// Criar a rota GET principal
router.get("/", (req, res) => {
    res.send("Bem-Vindo Pessoal alterado");
});
// Exporta a instrução da rota
export default router;
//# sourceMappingURL=login.js.map