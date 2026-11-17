
import { AppDataSource } from "../data-source.js";
import { Product } from "../entity/products.js";
import { ProductCategory } from "../entity/productCategories.js";
import { ProductSituation } from "../entity/productSituations.js";

export async function CreateProductsSeeds() {

    const productRepository = AppDataSource.getRepository(Product);
    const categoryRepository = AppDataSource.getRepository(ProductCategory);
    const situationRepository = AppDataSource.getRepository(ProductSituation);

    const category = await categoryRepository.findOne({
        where: { name: "Informática" }
    });

    const situation = await situationRepository.findOne({
        where: { name: "Ativo" }
    });

    if (!category || !situation) {
        throw new Error(
            "Cadastre uma categoria e uma situação antes dos produtos!"
        );
    }

    const products = [
        {
            name: "Notebook",
            slug: "notebook",
            description: "Notebook para uso pessoal e profissional.",
            price: 3500.00,
            productCategory: category,
            productSituation: situation,
        },
        {
            name: "Smartphone",
            slug: "smartphone",
            description: "Smartphone para comunicação e aplicativos.",
            price: 1800.00,
            productCategory: category,
            productSituation: situation,
        },
    ];

    for (const product of products) {

        const existingProduct = await productRepository.findOne({
            where: { slug: product.slug }
        });

        if (!existingProduct) {

            await productRepository.save(product);

            console.log(`Produto ${product.name} cadastrado com sucesso!`);

        } else {

            console.log(`Produto ${product.name} já existe. Nenhuma alteração realizada!`);

        }
    }
}
