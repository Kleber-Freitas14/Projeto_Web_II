
import express, { type Request, type Response } from "express";

import { AppDataSource } from "../data-source.js";
import { ProductSituation } from "../entity/productSituations.js";
import { PaginationService } from "../services/PaginationService.js";

const router = express.Router();

const productSituationRepository =
    AppDataSource.getRepository(ProductSituation);

// LISTAR SITUAÇÕES
router.get("/ProductSituations", async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(
            productSituationRepository,
            page,
            limit,
            { id: "DESC" }
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao listar situações dos produtos!",
            error,
        });
    }
});

// BUSCAR SITUAÇÃO POR ID
router.get("/ProductSituations/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const productSituation =
            await productSituationRepository.findOneBy({ id });

        if (!productSituation) {
            return res.status(404).json({
                message: "Situação não encontrada!",
            });
        }

        return res.status(200).json(productSituation);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar situação!",
            error,
        });
    }
});

// CADASTRAR SITUAÇÃO
router.post("/ProductSituations", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "O nome da situação é obrigatório!",
            });
        }

        const productSituation = productSituationRepository.create({
            name: name.trim(),
        });

        await productSituationRepository.save(productSituation);

        return res.status(201).json({
            message: "Situação cadastrada com sucesso!",
            data: productSituation,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao cadastrar situação!",
            error,
        });
    }
});

// ATUALIZAR SITUAÇÃO
router.put("/ProductSituations/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;

        const productSituation =
            await productSituationRepository.findOneBy({ id });

        if (!productSituation) {
            return res.status(404).json({
                message: "Situação não encontrada!",
            });
        }

        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "O nome da situação é obrigatório!",
            });
        }

        productSituation.name = name.trim();

        await productSituationRepository.save(productSituation);

        return res.status(200).json({
            message: "Situação atualizada com sucesso!",
            data: productSituation,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao atualizar situação!",
            error,
        });
    }
});

// EXCLUIR SITUAÇÃO
router.delete("/ProductSituations/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const productSituation =
            await productSituationRepository.findOneBy({ id });

        if (!productSituation) {
            return res.status(404).json({
                message: "Situação não encontrada!",
            });
        }

        await productSituationRepository.remove(productSituation);

        return res.status(200).json({
            message: "Situação excluída com sucesso!",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao excluir situação! Verifique se existem produtos utilizando essa situação.",
            error,
        });
    }
});

export default router;
