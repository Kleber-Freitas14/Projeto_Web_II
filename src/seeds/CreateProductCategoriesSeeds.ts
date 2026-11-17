
import { AppDataSource } from "../data-source.js";
import { ProductCategory } from "../entity/productCategories.js";

export async function CreateProductCategoriesSeeds() {

    const productCategoryRepository =
        AppDataSource.getRepository(ProductCategory);

    const productCategories = [
        "Informática",
        "Eletrônicos",
        "Eletrodomésticos",
    ];

    for (const name of productCategories) {

        const existingCategory = await productCategoryRepository.findOne({
            where: { name }
        });

        if (!existingCategory) {

            await productCategoryRepository.save({ name });

            console.log(`Categoria ${name} cadastrada com sucesso!`);

        } else {

            console.log(`Categoria ${name} já existe. Nenhuma alteração realizada!`);

        }
    }
}
