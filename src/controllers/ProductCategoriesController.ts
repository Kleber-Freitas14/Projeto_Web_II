
import express, { type Request, type Response } from "express";
import { AppDataSource } from "../data-source.js";
import { ProductCategory } from "../entity/productCategories.js";
import { PaginationService } from "../services/PaginationService.js";

const router = express.Router();

// GET - Listar todas as categorias
router.get("/ProductCategories", async (req: Request, res: Response) => {
    try {
        const productCategoryRepository =
            AppDataSource.getRepository(ProductCategory);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(
            productCategoryRepository,
            page,
            limit,
            { id: "DESC" }
        );

        res.status(200).json(result);
        return;

    } catch (error) {
        console.error("Erro ao listar categorias:", error);

        res.status(500).json({
            mensagem: "Erro ao listar categorias!"
        });
        return;
    }
});

// GET - Visualizar categoria pelo ID
router.get("/ProductCategories/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const productCategoryRepository =
            AppDataSource.getRepository(ProductCategory);

        const productCategory = await productCategoryRepository.findOneBy({
            id
        });

        if (!productCategory) {
            res.status(404).json({
                mensagem: "Categoria não encontrada!"
            });
            return;
        }

        res.status(200).json(productCategory);
        return;

    } catch (error) {
        console.error("Erro ao buscar categoria:", error);

        res.status(500).json({
            mensagem: "Erro ao visualizar categoria!"
        });
        return;
    }
});

// POST - Cadastrar categoria
router.post("/ProductCategories", async (req: Request, res: Response) => {
    try {
        const { name } = req.body ?? {};

        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({
                mensagem: "O campo name é obrigatório!"
            });
            return;
        }

        const productCategoryRepository =
            AppDataSource.getRepository(ProductCategory);

        const newProductCategory = productCategoryRepository.create({
            name: name.trim()
        });

        await productCategoryRepository.save(newProductCategory);

        res.status(201).json({
            mensagem: "Categoria cadastrada com sucesso!",
            productCategory: newProductCategory
        });
        return;

    } catch (error) {
        console.error("Erro ao cadastrar categoria:", error);

        res.status(500).json({
            mensagem: "Erro ao cadastrar categoria!"
        });
        return;
    }
});

// PUT - Atualizar categoria
router.put("/ProductCategories/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body ?? {};

        const productCategoryRepository =
            AppDataSource.getRepository(ProductCategory);

        const productCategory = await productCategoryRepository.findOneBy({
            id
        });

        if (!productCategory) {
            res.status(404).json({
                mensagem: "Categoria não encontrada!"
            });
            return;
        }

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                res.status(400).json({
                    mensagem: "O nome da categoria não pode ficar vazio!"
                });
                return;
            }

            productCategory.name = name.trim();
        }

        const updatedProductCategory =
            await productCategoryRepository.save(productCategory);

        res.status(200).json({
            mensagem: "Categoria atualizada com sucesso!",
            productCategory: updatedProductCategory
        });
        return;

    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);

        res.status(500).json({
            mensagem: "Erro ao atualizar categoria!"
        });
        return;
    }
});

// DELETE - Remover categoria
router.delete("/ProductCategories/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const productCategoryRepository =
            AppDataSource.getRepository(ProductCategory);

        const productCategory = await productCategoryRepository.findOneBy({
            id
        });

        if (!productCategory) {
            res.status(404).json({
                mensagem: "Categoria não encontrada!"
            });
            return;
        }

        await productCategoryRepository.remove(productCategory);

        res.status(200).json({
            mensagem: "Categoria removida com sucesso!"
        });
        return;

    } catch (error) {
        console.error("Erro ao remover categoria:", error);

        res.status(500).json({
            mensagem: "Erro ao remover categoria!"
        });
        return;
    }
});

export default router;
