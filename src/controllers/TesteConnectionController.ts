// Importar a biblioteca Express

import express, {type Request, type Response} from "express";


// Criar a aplicação Express
const router = express.Router()


// Criar a rota GET principal
router.get("/test-connection", (req:Request, res:Response)=>{
    res.status(200).json({message: "Conexão com API realizada com sucesso!"});
})

// Exporta a instrução da rota
export default router 