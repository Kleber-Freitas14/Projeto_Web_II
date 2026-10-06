import { DataSource } from "typeorm";
import { ProductSituation } from "../entity/productSituations.js";

export default class CreateProductSituationsSeeds {

    public async run(datasource: DataSource): Promise<void> {

        console.log("Iniciando o seed para a tabela 'product_situations'...");

        const productSituationRepository =
            datasource.getRepository(ProductSituation);

        const existingCount = await productSituationRepository.count();

        if (existingCount > 0) {
            console.log(
                "A tabela 'product_situations' já possui dados. Nenhuma alteração foi realizada!"
            );
            return;
        }

        const productSituations = [
            {
                product: { idProduct: 1 },
                situation: { id: 1 }
            },
            {
                product: { idProduct: 2 },
                situation: { id: 1 }
            },
            {
                product: { idProduct: 3 },
                situation: { id: 1 }
            }
        ];

        await productSituationRepository.save(productSituations);

        console.log(
            "Seed concluído com sucesso: Situações dos produtos cadastradas!"
        );
    }
}