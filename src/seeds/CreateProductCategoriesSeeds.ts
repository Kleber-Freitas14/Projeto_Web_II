
import { DataSource } from "typeorm";
import { ProductCategory } from "../entity/productCategories.js";

export default class CreateProductCategoriesSeeds {

    public async run(datasource: DataSource): Promise<void> {

        console.log("Iniciando o seed para a tabela 'product_categories'...");

        const productCategoryRepository = datasource.getRepository(ProductCategory);

        const existingCount = await productCategoryRepository.count();

        if (existingCount > 0) {
            console.log("A tabela 'product_categories' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const productCategories = [
            { nameProductCategory: "Eletrônicos" },
            { nameProductCategory: "Informática" },
            { nameProductCategory: "Acessórios" }
        ];

        await productCategoryRepository.save(productCategories);

        console.log("Seed concluído com sucesso: Categorias de produtos cadastradas!");
    }
}
