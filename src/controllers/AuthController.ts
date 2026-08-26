// Importar a biblioteca Express

import express, {type Request, type Response} from "express";


// Criar a aplicação Express
const router = express.Router()


// Criar a rota GET principal
router.get("/", (req:Request, res:Response)=>{
    res.send("Bem-Vindo Pessoal alterado")
})

// Exporta a instrução da rota
export default router 