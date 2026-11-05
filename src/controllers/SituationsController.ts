
import express, { type Request, type Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Situation } from "../entity/situations.js";
import { PaginationService } from "../services/PaginationService.js";
import * as yup from "yup";

// Criar a aplicação Express
const router = express.Router();

// Schema de validação
const situationSchema = yup.object({
    nameSituation: yup.string()
        .transform((value) => value?.trim())
        .typeError("O campo deve ser um texto!")
        .required("O campo nome é obrigatório!")
        .min(3, "O campo nome deve ter no mínimo 3 caracteres!")
});

// GET - Listar todas as situações
router.get("/Situations", async (req: Request, res: Response) => {
    try {
        const situationRepository = AppDataSource.getRepository(Situation);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        if (!Number.isInteger(page) || page < 1 ||
            !Number.isInteger(limit) || limit < 1) {
            res.status(400).json({
                mensagem: "Página e limite devem ser números inteiros positivos!"
            });
            return;
        }

        const result = await PaginationService.paginate(
            situationRepository,
            page,
            limit,
            { id: "DESC" }
        );

        res.status(200).json(result);
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
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            res.status(400).json({
                mensagem: "ID inválido!"
            });
            return;
        }

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({ id });

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
// POST - Cadastrar situação

router.post("/Situations", async (req: Request, res: Response) => {
    try {

        console.log("BODY RECEBIDO:", req.body);

        const nameSituation = req.body?.nameSituation;

        // Verificar se o campo está vazio
        if (nameSituation === undefined ||
            nameSituation === null ||
            typeof nameSituation !== "string" ||
            nameSituation.trim() === "") {

            res.status(400).json({
                mensagem: "O campo nome é obrigatório!"
            });
            return;
        }

        // Verificar quantidade mínima de caracteres
        if (nameSituation.trim().length < 3) {

            res.status(400).json({
                mensagem: "O campo nome deve ter no mínimo 3 caracteres!"
            });
            return;
        }

        const situationRepository =
            AppDataSource.getRepository(Situation);

        const newSituation = situationRepository.create({
            nameSituation: nameSituation.trim()
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
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            res.status(400).json({
                mensagem: "ID inválido!"
            });
            return;
        }

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({ id });

        if (!situation) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }

        const data = await situationSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        situationRepository.merge(situation, data);

        const updatedSituation = await situationRepository.save(situation);

        res.status(200).json({
            mensagem: "Situação atualizada com sucesso!",
            situation: updatedSituation
        });
        return;

    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                mensagem: "Erro de validação!",
                erros: error.errors
            });
            return;
        }

        console.error("Erro ao atualizar situação:", error);

        res.status(500).json({
            mensagem: "Erro ao atualizar situação!"
        });
        return;
    }
});

// DELETE - Remover situação
router.delete("/Situations/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            res.status(400).json({
                mensagem: "ID inválido!"
            });
            return;
        }

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({ id });

        if (!situation) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }

        await situationRepository.remove(situation);

        res.status(200).json({
            mensagem: "Situação removida com sucesso!"
        });
        return;

    } catch (error) {
        console.error("Erro ao remover situação:", error);

        res.status(500).json({
            mensagem: "Erro ao remover situação!"
        });
        return;
    }
});

export default router;
