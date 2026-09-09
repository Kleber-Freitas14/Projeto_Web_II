import express, { type Request, type Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Situation } from "../entity/situations.js";

// Criar a aplicação Express
const router = express.Router();


// GET - Listar todas as situações
router.get("/Situations", async (req: Request, res: Response) => {
    try {

        const situationRepository =
            AppDataSource.getRepository(Situation);

        const situations = await situationRepository.find();

        res.status(200).json(situations);
        return;

    } catch (error) {

        console.error("Erro ao listar situações:", error);

        res.status(500).json({
            mensagem: "Erro ao listar situações!"
        });

        return;
    }
});


// GET - Visualizar uma situação pelo ID
router.get("/Situations/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string;

        const situationRepository =
            AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({
            id: parseInt(id)
        });

        if (!situation) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }

        res.status(200).json(situation);
        return;

    } catch (error) {

        console.error("Erro ao buscar situação:", error);

        res.status(500).json({
            mensagem: "Erro ao visualizar situação!"
        });

        return;
    }
});


// POST - Cadastrar situação
router.post("/Situations", async (req: Request, res: Response) => {
    try {

        console.log("Dados recebidos:", req.body);

        const { nameSituation } = req.body ?? {};

        if (!nameSituation) {
            res.status(400).json({
                mensagem: "O campo nameSituation é obrigatório!"
            });
            return;
        }

        const situationRepository =
            AppDataSource.getRepository(Situation);

        const newSituation = situationRepository.create({
            nameSituation
        });

        await situationRepository.save(newSituation);

        res.status(201).json({
            mensagem: "Situação cadastrada com sucesso!",
            situation: newSituation
        });

        return;

    } catch (error) {

        console.error("Erro ao cadastrar situação:", error);

        res.status(500).json({
            mensagem: "Erro ao cadastrar situação!"
        });

        return;
    }
});


// PUT - Atualizar situação
router.put("/Situations/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string;

        const data = req.body;

        const situationRepository =
            AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({
            id: parseInt(id)
        });

        if (!situation) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }

        // Atualiza os dados
        situationRepository.merge(situation, data);

        // Salva as alterações
        const updatedSituation =
            await situationRepository.save(situation);

        res.status(200).json({
            mensagem: "Situação atualizada com sucesso!",
            situation: updatedSituation
        });

        return;

    } catch (error) {

        console.error("Erro ao atualizar situação:", error);

        res.status(500).json({
            mensagem: "Erro ao atualizar situação!"
        });

        return;
    }
});


export default router;