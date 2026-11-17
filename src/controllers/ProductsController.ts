import express, { type Request, type Response } from "express";

import { AppDataSource } from "../data-source.js";
import { Product } from "../entity/products.js";
import { ProductCategory } from "../entity/productCategories.js";
import { ProductSituation } from "../entity/productSituations.js";
import { PaginationService } from "../services/PaginationService.js";

const router = express.Router();

const productRepository = AppDataSource.getRepository(Product);
const categoryRepository = AppDataSource.getRepository(ProductCategory);
const situationRepository = AppDataSource.getRepository(ProductSituation);

// GERAR SLUG A PARTIR DO NOME
function gerarSlugBase(nome: string): string {
  const slug = nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Evita gerar um slug vazio
  return slug || "produto";
}

// GERAR SLUG ÚNICO
async function gerarSlugDisponivel(
  nome: string,
  ignorarId?: number,
): Promise<string> {
  const base = gerarSlugBase(nome);

  let slug = base;
  let contador = 2;

  while (true) {
    const existente = await productRepository.findOneBy({ slug });

    // Slug disponível ou pertencente ao próprio produto atualizado
    if (!existente || existente.id === ignorarId) {
      return slug;
    }

    slug = `${base}-${contador}`;
    contador++;
  }
}

// VALIDAR ID
function validarId(id: unknown): number | null {
  const valor = Number(id);

  if (!Number.isInteger(valor) || valor <= 0) {
    return null;
  }

  return valor;
}

// VALIDAR PREÇO
function validarPreco(preco: unknown): number | null {
  if (
    preco === undefined ||
    preco === null ||
    preco === "" ||
    (typeof preco === "string" && preco.trim() === "")
  ) {
    return null;
  }

  const valor = Number(preco);

  if (!Number.isFinite(valor) || valor < 0) {
    return null;
  }

  return valor;
}

// LISTAR PRODUTOS
router.get("/Products", async (req: Request, res: Response) => {
  try {
    const page = validarId(req.query.page ?? 1);
    const limit = validarId(req.query.limit ?? 10);

    if (page === null || limit === null) {
      return res.status(400).json({
        message: "Página e limite devem ser números inteiros positivos!",
      });
    }

    const result = await PaginationService.paginate(
      productRepository,
      page,
      limit,
      { id: "DESC" },
      {
        productCategory: true,
        productSituation: true,
      },
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("ERRO AO LISTAR PRODUTOS:", error);

    return res.status(500).json({
      message: "Erro ao listar produtos!",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// BUSCAR PRODUTO POR ID
router.get("/Products/:id", async (req: Request, res: Response) => {
  try {
    const id = validarId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "ID do produto inválido!",
      });
    }

    const product = await productRepository.findOne({
      where: { id },
      relations: {
        productCategory: true,
        productSituation: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Produto não encontrado!",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("ERRO AO BUSCAR PRODUTO:", error);

    return res.status(500).json({
      message: "Erro ao buscar produto!",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// CADASTRAR PRODUTO
router.post("/Products", async (req: Request, res: Response) => {
  try {
    const { name, description, price, productCategoryId, productSituationId } =
      req.body;

    // VALIDAR CAMPOS OBRIGATÓRIOS
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      price === undefined ||
      price === null ||
      price === "" ||
      productCategoryId === undefined ||
      productSituationId === undefined
    ) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios!",
      });
    }

    // VALIDAR PREÇO
    const valor = validarPreco(price);

    if (valor === null) {
      return res.status(400).json({
        message: "Informe um preço válido e não negativo!",
      });
    }

    // VALIDAR ID DA CATEGORIA
    const categoryId = validarId(productCategoryId);

    if (categoryId === null) {
      return res.status(400).json({
        message: "ID da categoria inválido!",
      });
    }

    // VALIDAR CATEGORIA
    const category = await categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) {
      return res.status(404).json({
        message: "Categoria não encontrada!",
      });
    }

    // VALIDAR ID DA SITUAÇÃO
    const situationId = validarId(productSituationId);

    if (situationId === null) {
      return res.status(400).json({
        message: "ID da situação inválido!",
      });
    }

    // VALIDAR SITUAÇÃO
    const situation = await situationRepository.findOneBy({
      id: situationId,
    });

    if (!situation) {
      return res.status(404).json({
        message: "Situação do produto não encontrada!",
      });
    }

    // GERAR SLUG AUTOMATICAMENTE
    const slug = await gerarSlugDisponivel(name);

    // CRIAR PRODUTO
    const product = productRepository.create({
      name: name.trim(),
      slug,
      description: description.trim(),
      price: valor,
      productCategory: category,
      productSituation: situation,
    });

    // SALVAR NO BANCO
    await productRepository.save(product);

    return res.status(201).json({
      message: "Produto cadastrado com sucesso!",
      data: product,
    });
  } catch (error) {
    console.error("ERRO AO CADASTRAR PRODUTO:", error);

    return res.status(500).json({
      message: "Erro ao cadastrar produto!",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// ATUALIZAR PRODUTO
router.put("/Products/:id", async (req: Request, res: Response) => {
  try {
    const id = validarId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "ID do produto inválido!",
      });
    }

    const product = await productRepository.findOneBy({ id });

    if (!product) {
      return res.status(404).json({
        message: "Produto não encontrado!",
      });
    }

    const {
      name,
      slug,
      description,
      price,
      productCategoryId,
      productSituationId,
    } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Informe um nome válido!",
        });
      }

      product.name = name.trim();
    }

    if (slug !== undefined) {
      if (typeof slug !== "string" || !slug.trim()) {
        return res.status(400).json({
          message: "Informe um slug válido!",
        });
      }

      product.slug = slug.trim();
    } else if (name !== undefined) {
      product.slug = await gerarSlugDisponivel(product.name, id);
    }

    const slugExists = await productRepository.findOneBy({
      slug: product.slug,
    });

    if (slugExists && slugExists.id !== id) {
      return res.status(409).json({
        message: "Já existe outro produto cadastrado com este slug!",
      });
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({
          message: "Informe uma descrição válida!",
        });
      }

      product.description = description.trim();
    }

    if (price !== undefined) {
      const valor = validarPreco(price);

      if (valor === null) {
        return res.status(400).json({
          message: "Informe um preço válido e não negativo!",
        });
      }

      product.price = valor;
    }

    if (productCategoryId !== undefined) {
      const categoryId = validarId(productCategoryId);

      if (categoryId === null) {
        return res.status(400).json({
          message: "ID da categoria inválido!",
        });
      }

      const category = await categoryRepository.findOneBy({
        id: categoryId,
      });

      if (!category) {
        return res.status(404).json({
          message: "Categoria não encontrada!",
        });
      }

      product.productCategory = category;
    }

    if (productSituationId !== undefined) {
      const situationId = validarId(productSituationId);

      if (situationId === null) {
        return res.status(400).json({
          message: "ID da situação inválido!",
        });
      }

      const situation = await situationRepository.findOneBy({
        id: situationId,
      });

      if (!situation) {
        return res.status(404).json({
          message: "Situação do produto não encontrada!",
        });
      }

      product.productSituation = situation;
    }

    await productRepository.save(product);

    // BUSCAR PRODUTO ATUALIZADO COM RELACIONAMENTOS
    const produtoAtualizado = await productRepository.findOne({
      where: { id },
      relations: {
        productCategory: true,
        productSituation: true,
      },
    });

    return res.status(200).json({
      message: "Produto atualizado com sucesso!",
      data: produtoAtualizado,
    });
  } catch (error) {
    console.error("ERRO AO ATUALIZAR PRODUTO:", error);

    return res.status(500).json({
      message: "Erro ao atualizar produto!",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// EXCLUIR PRODUTO DEFINITIVAMENTE
router.delete("/Products/:id", async (req: Request, res: Response) => {
  try {
    const id = validarId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "ID do produto inválido!",
      });
    }

    const product = await productRepository.findOneBy({ id });

    if (!product) {
      return res.status(404).json({
        message: "Produto não encontrado!",
      });
    }

    await productRepository.remove(product);

    return res.status(200).json({
      message: "Produto excluído definitivamente com sucesso!",
      id: product.id,
    });
  } catch (error) {
    console.error("ERRO AO EXCLUIR PRODUTO:", error);

    return res.status(500).json({
      message: "Erro ao excluir produto!",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
