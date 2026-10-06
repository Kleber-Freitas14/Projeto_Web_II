import { DataSource } from "typeorm";
import { Product } from "../entity/products.js";

export default class CreateProductsSeeds {

    public async run(datasource: DataSource): Promise<void> {

        console.log("Iniciando o seed para a tabela 'products'...");

        const productRepository = datasource.getRepository(Product);

        const existingCount = await productRepository.count();

        if (existingCount > 0) {
            console.log("A tabela 'products' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const products = [
            {
                nameProduct: "Notebook",
                priceProduct: 3500.00,
                productCategory: {
                    idProductCategory: 1
                }
            },
            {
                nameProduct: "Mouse",
                priceProduct: 80.00,
                productCategory: {
                    idProductCategory: 3
                }
            },
            {
                nameProduct: "Teclado",
                priceProduct: 150.00,
                productCategory: {
                    idProductCategory: 3
                }
            }
        ];

        await productRepository.save(products);

        console.log("Seed concluído com sucesso: Produtos cadastrados!");
    }
}