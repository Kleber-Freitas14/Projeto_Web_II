
import express, { type Request, type Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Product } from "../entity/products.js";
import { ProductCategory } from "../entity/productCategories.js";
import { PaginationService } from "../services/PaginationService.js";

// Criar a aplicação Express
const router = express.Router();

// GET - Listar todos os produtos
router.get("/Products", async (req: Request, res: Response) => {
    try {
        const productRepository =
            AppDataSource.getRepository(Product);

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(
            productRepository,
            page,
            limit,
            { idProduct: "DESC" }
        );

        res.status(200).json(result);
        return;

    } catch (error) {

        console.error("Erro ao listar produtos:", error);

        res.status(500).json({
            mensagem: "Erro ao listar produtos!"
        });

        return;
    }
});

// GET - Visualizar produto pelo ID
router.get("/Products/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string;

        const productRepository =
            AppDataSource.getRepository(Product);

        const product = await productRepository.findOneBy({
            idProduct: parseInt(id)
        });

        if (!product) {
            res.status(404).json({
                mensagem: "Produto não encontrado!"
            });
            return;
        }

        res.status(200).json(product);
        return;

    } catch (error) {

        console.error("Erro ao buscar produto:", error);

        res.status(500).json({
            mensagem: "Erro ao visualizar produto!"
        });

        return;
    }
});

// POST - Cadastrar produto
router.post("/Products", async (req: Request, res: Response) => {
    try {

        console.log("Dados recebidos:", req.body);

        const {
            nameProduct,
            priceProduct,
            idProductCategory
        } = req.body ?? {};

        if (!nameProduct || priceProduct === undefined || !idProductCategory) {
            res.status(400).json({
                mensagem:
                    "Os campos nameProduct, priceProduct e idProductCategory são obrigatórios!"
            });
            return;
        }

        const productRepository =
            AppDataSource.getRepository(Product);

        const productCategoryRepository =
            AppDataSource.getRepository(ProductCategory);

        const productCategory =
            await productCategoryRepository.findOneBy({
                idProductCategory: parseInt(idProductCategory)
            });

        if (!productCategory) {
            res.status(404).json({
                mensagem: "Categoria de produto não encontrada!"
            });
            return;
        }

        const newProduct = productRepository.create({
            nameProduct,
            priceProduct,
            productCategory
        });

        await productRepository.save(newProduct);

        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            product: newProduct
        });

        return;

    } catch (error) {

        console.error("Erro ao cadastrar produto:", error);

        res.status(500).json({
            mensagem: "Erro ao cadastrar produto!"
        });

        return;
    }
});

// PUT - Atualizar produto
router.put("/Products/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string;

        const {
            nameProduct,
            priceProduct,
            idProductCategory
        } = req.body ?? {};

        const productRepository =
            AppDataSource.getRepository(Product);

        const productCategoryRepository =
            AppDataSource.getRepository(ProductCategory);

        const product = await productRepository.findOneBy({
            idProduct: parseInt(id)
        });

        if (!product) {
            res.status(404).json({
                mensagem: "Produto não encontrado!"
            });
            return;
        }

        if (nameProduct !== undefined) {
            product.nameProduct = nameProduct;
        }

        if (priceProduct !== undefined) {
            product.priceProduct = priceProduct;
        }

        if (idProductCategory !== undefined) {

            const productCategory =
                await productCategoryRepository.findOneBy({
                    idProductCategory: parseInt(idProductCategory)
                });

            if (!productCategory) {
                res.status(404).json({
                    mensagem: "Categoria de produto não encontrada!"
                });
                return;
            }

            product.productCategory = productCategory;
        }

        const updatedProduct =
            await productRepository.save(product);

        res.status(200).json({
            mensagem: "Produto atualizado com sucesso!",
            product: updatedProduct
        });

        return;

    } catch (error) {

        console.error("Erro ao atualizar produto:", error);

        res.status(500).json({
            mensagem: "Erro ao atualizar produto!"
        });

        return;
    }
});

// DELETE - Remover produto
router.delete("/Products/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string;

        const productRepository =
            AppDataSource.getRepository(Product);

        const product = await productRepository.findOneBy({
            idProduct: parseInt(id)
        });

        if (!product) {
            res.status(404).json({
                mensagem: "Produto não encontrado!"
            });
            return;
        }

        await productRepository.remove(product);

        res.status(200).json({
            mensagem: "Produto removido com sucesso!"
        });

        return;

    } catch (error) {

        console.error("Erro ao remover produto:", error);

        res.status(500).json({
            mensagem: "Erro ao remover produto!"
        });

        return;
    }
});

export default router;
