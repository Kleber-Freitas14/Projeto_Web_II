import express, { type Request, type Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Situation } from "../entity/situations.js";

//Criar a Aplicação Express
const router = express.Router();

// Criar a Visualização do item cadastrado em situação
router.get("/Situations/:id", async (req: Request, res: Response) => {
    try {

        const id= req.params.id;
        const situationRepository = AppDataSource.getRepository(Situation);

        const situations = await situationRepository.findOneBy({id : parseInt(id)});

        if(!situations){
           res.status(404).json({
            mensagem: "Situação não encontrada!"
        });
        return 
        }
        
        res.status(200).json(situations);
        return

    } catch (error) {
        console.error("Erro ao buscar situações:", error);

        res.status(500).json({
            mensagem: "Erro ao buscar situações!"
        });
        return
    }
});

// POST - Cadastrar situação
router.post("/Situations", async (req: Request, res: Response) => {
    try {
        console.log("Dados recebidos:", req.body);

        const { nameSituation } = req.body ?? {};

        if (!nameSituation) {
            return res.status(400).json({
                mensagem: "O campo nameSituation é obrigatório!"
            });
        }

        const situationRepository =
            AppDataSource.getRepository(Situation);

        const newSituation = situationRepository.create({
            nameSituation
        });

        await situationRepository.save(newSituation);

        res.status(201).json({
            mensagem: "Situação Cadastrada com Sucesso",
            situation: newSituation,
        });

    } catch (error) {
        console.error("Erro ao cadastrar situação:", error);

        res.status(500).json({
            mensagem: "Erro ao Cadastrar Situação!"
        });
    }
});

export default router;