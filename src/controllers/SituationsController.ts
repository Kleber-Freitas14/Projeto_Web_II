
import express, { type Request, type Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Situation } from "../entity/situations.js";
import { PaginationService } from "../services/PaginationService.js";
import * as yup from "yup";

const router = express.Router();

// Schema de validação
const situationSchema = yup.object({
    nameSituation: yup.string()
        .transform((value) => value?.trim())
        .typeError("O campo deve ser um texto!")
        .required("O campo nome é obrigatório!")
        .min(3, "O campo nome deve ter no mínimo 3 caracteres!")
});

// Função para tratar erros de validação
function tratarErroValidacao(error: yup.ValidationError, res: Response) {
    return res.status(400).json({
        mensagem: "Erro de validação!",
        erros: error.errors
    });
}

// GET - Listar todas as situações
router.get("/Situations", async (req: Request, res: Response) => {
    try {
        const situationRepository = AppDataSource.getRepository(Situation);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        if (
            !Number.isInteger(page) || page < 1 ||
            !Number.isInteger(limit) || limit < 1
        ) {
            return res.status(400).json({
                mensagem: "Página e limite devem ser números inteiros positivos!"
            });
        }

        const result = await PaginationService.paginate(
            situationRepository,
            page,
            limit,
            { id: "DESC" }
        );

        return res.status(200).json(result);

    } catch (error) {
        console.error("Erro ao listar situações:", error);

        return res.status(500).json({
            mensagem: "Erro ao listar situações!"
        });
    }
});

// GET - Visualizar uma situação pelo ID
router.get("/Situations/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                mensagem: "ID inválido!"
            });
        }

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({ id });

        if (!situation) {
            return res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
        }

        return res.status(200).json(situation);

    } catch (error) {
        console.error("Erro ao buscar situação:", error);

        return res.status(500).json({
            mensagem: "Erro ao visualizar situação!"
        });
    }
});

// POST - Cadastrar situação
router.post("/Situations", async (req: Request, res: Response) => {
    try {
        const data = await situationSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        const repo = AppDataSource.getRepository(Situation);

        // Verificar se já existe uma situação com esse nome
        const existingSituation = await repo
            .createQueryBuilder("situation")
            .where("LOWER(situation.nameSituation) = LOWER(:nome)", {
                nome: data.nameSituation
            })
            .getOne();

        if (existingSituation) {
            return res.status(400).json({
                mensagem: "Já existe uma situação cadastrada com esse nome!"
            });
        }

        const novaSituacao = repo.create(data);

        await repo.save(novaSituacao);

        return res.status(201).json({
            mensagem: "Situação cadastrada com sucesso!",
            situation: novaSituacao
        });

    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return tratarErroValidacao(error, res);
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "ER_DUP_ENTRY"
        ) {
            return res.status(400).json({
                mensagem: "Já existe uma situação cadastrada com esse nome!"
            });
        }

        console.error("ERRO DETALHADO NO POST:", error);

        return res.status(500).json({
            mensagem: "Erro interno do servidor!",
            erro: error instanceof Error ? error.message : String(error)
        });
    }
});

// PUT - Atualizar situação
router.put("/Situations/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                mensagem: "ID inválido!"
            });
        }

        const situationRepository = AppDataSource.getRepository(Situation);

        // Localizar a situação que será atualizada
        const situation = await situationRepository.findOneBy({ id });

        if (!situation) {
            return res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
        }

        // Validar os dados recebidos
        const data = await situationSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        // Verificar duplicidade, desconsiderando o próprio registro
        const situacaoExistente = await situationRepository
            .createQueryBuilder("situation")
            .where("LOWER(situation.nameSituation) = LOWER(:nome)", {
                nome: data.nameSituation
            })
            .andWhere("situation.id != :id", { id })
            .getOne();

        if (situacaoExistente) {
            return res.status(400).json({
                mensagem: "Já existe uma situação cadastrada com esse nome!"
            });
        }

        // Atualizar e salvar
        situationRepository.merge(situation, data);

        const updatedSituation = await situationRepository.save(situation);

        return res.status(200).json({
            mensagem: "Situação atualizada com sucesso!",
            situation: updatedSituation
        });

    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return tratarErroValidacao(error, res);
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "ER_DUP_ENTRY"
        ) {
            return res.status(400).json({
                mensagem: "Já existe uma situação cadastrada com esse nome!"
            });
        }

        console.error("ERRO DETALHADO NO PUT:", error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar situação!",
            erro: error instanceof Error ? error.message : String(error)
        });
    }
});

// DELETE - Remover situação
router.delete("/Situations/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                mensagem: "ID inválido!"
            });
        }

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({ id });

        if (!situation) {
            return res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
        }

        await situationRepository.remove(situation);

        return res.status(200).json({
            mensagem: "Situação removida com sucesso!"
        });

    } catch (error) {
        console.error("Erro ao remover situação:", error);

        return res.status(500).json({
            mensagem: "Erro ao remover situação!"
        });
    }
});

export default router;
