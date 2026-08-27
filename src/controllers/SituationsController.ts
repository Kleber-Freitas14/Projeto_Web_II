import express, { type Request, type Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Situation } from "../entity/situations.js";

const router = express.Router();

// GET - Listar todas as situações
router.get("/Situations", async (req: Request, res: Response) => {
    try {
        const situationRepository = AppDataSource.getRepository(Situation);

        const situations = await situationRepository.find();

        res.status(200).json(situations);

    } catch (error) {
        console.error("Erro ao buscar situações:", error);

        res.status(500).json({
            mensagem: "Erro ao buscar situações!"
        });
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