
import express, { type Request, type Response } from "express";
import { AppDataSource } from "../data-source.js";
import { ProductSituation } from "../entity/productSituations.js";
import { Product } from "../entity/products.js";
import { Situation } from "../entity/situations.js";
import { PaginationService } from "../services/PaginationService.js";

// Criar a aplicação Express
const router = express.Router();

// GET - Listar todas as relações produto/situação
router.get("/ProductSituations", async (req: Request, res: Response) => {
    try {

        const productSituationRepository =
            AppDataSource.getRepository(ProductSituation);

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(
            productSituationRepository,
            page,
            limit,
            { idProductSituation: "DESC" }
        );

        res.status(200).json(result);
        return;

    } catch (error) {

        console.error("Erro ao listar situações dos produtos:", error);

        res.status(500).json({
            mensagem: "Erro ao listar situações dos produtos!"
        });

        return;
    }
});

// GET - Visualizar uma relação pelo ID
router.get("/ProductSituations/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string;

        const productSituationRepository =
            AppDataSource.getRepository(ProductSituation);

        const productSituation =
            await productSituationRepository.findOneBy({
                idProductSituation: parseInt(id)
            });

        if (!productSituation) {
            res.status(404).json({
                mensagem: "Relação produto/situação não encontrada!"
            });
            return;
        }

        res.status(200).json(productSituation);
        return;

    } catch (error) {

        console.error("Erro ao buscar situação do produto:", error);

        res.status(500).json({
            mensagem: "Erro ao visualizar situação do produto!"
        });

        return;
    }
});

// POST - Associar produto a uma situação
router.post("/ProductSituations", async (req: Request, res: Response) => {
    try {

        console.log("Dados recebidos:", req.body);

        const {
            idProduct,
            idSituation
        } = req.body ?? {};

        if (!idProduct || !idSituation) {
            res.status(400).json({
                mensagem: "Os campos idProduct e idSituation são obrigatórios!"
            });
            return;
        }

        const productRepository =
            AppDataSource.getRepository(Product);

        const situationRepository =
            AppDataSource.getRepository(Situation);

        const productSituationRepository =
            AppDataSource.getRepository(ProductSituation);

        const product = await productRepository.findOneBy({
            idProduct: parseInt(idProduct)
        });

        if (!product) {
            res.status(404).json({
                mensagem: "Produto não encontrado!"
            });
            return;
        }

        const situation = await situationRepository.findOneBy({
            id: parseInt(idSituation)
        });

        if (!situation) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }

        const newProductSituation =
            productSituationRepository.create({
                product,
                situation
            });

        await productSituationRepository.save(newProductSituation);

        res.status(201).json({
            mensagem: "Situação do produto cadastrada com sucesso!",
            productSituation: newProductSituation
        });

        return;

    } catch (error) {

        console.error("Erro ao cadastrar situação do produto:", error);

        res.status(500).json({
            mensagem: "Erro ao cadastrar situação do produto!"
        });

        return;
    }
});

// PUT - Alterar a situação do produto
router.put("/ProductSituations/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string;

        const { idProduct, idSituation } = req.body ?? {};

        const productSituationRepository =
            AppDataSource.getRepository(ProductSituation);

        const productRepository =
            AppDataSource.getRepository(Product);

        const situationRepository =
            AppDataSource.getRepository(Situation);

        const productSituation =
            await productSituationRepository.findOneBy({
                idProductSituation: parseInt(id)
            });

        if (!productSituation) {
            res.status(404).json({
                mensagem: "Relação produto/situação não encontrada!"
            });
            return;
        }

        if (idProduct !== undefined) {

            const product = await productRepository.findOneBy({
                idProduct: parseInt(idProduct)
            });

            if (!product) {
                res.status(404).json({
                    mensagem: "Produto não encontrado!"
                });
                return;
            }

            productSituation.product = product;
        }

        if (idSituation !== undefined) {

            const situation = await situationRepository.findOneBy({
                id: parseInt(idSituation)
            });

            if (!situation) {
                res.status(404).json({
                    mensagem: "Situação não encontrada!"
                });
                return;
            }

            productSituation.situation = situation;
        }

        const updatedProductSituation =
            await productSituationRepository.save(productSituation);

        res.status(200).json({
            mensagem: "Situação do produto atualizada com sucesso!",
            productSituation: updatedProductSituation
        });

        return;

    } catch (error) {

        console.error("Erro ao atualizar situação do produto:", error);

        res.status(500).json({
            mensagem: "Erro ao atualizar situação do produto!"
        });

        return;
    }
});

// DELETE - Remover relação produto/situação
router.delete("/ProductSituations/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string;

        const productSituationRepository =
            AppDataSource.getRepository(ProductSituation);

        const productSituation =
            await productSituationRepository.findOneBy({
                idProductSituation: parseInt(id)
            });

        if (!productSituation) {
            res.status(404).json({
                mensagem: "Relação produto/situação não encontrada!"
            });
            return;
        }

        await productSituationRepository.remove(productSituation);

        res.status(200).json({
            mensagem: "Situação do produto removida com sucesso!"
        });

        return;

    } catch (error) {

        console.error("Erro ao remover situação do produto:", error);

        res.status(500).json({
            mensagem: "Erro ao remover situação do produto!"
        });

        return;
    }
});

export default router;
