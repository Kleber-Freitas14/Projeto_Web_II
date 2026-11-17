
import { AppDataSource } from "../data-source.js";
import { ProductSituation } from "../entity/productSituations.js";

export async function CreateProductSituationsSeeds() {

    const productSituationRepository =
        AppDataSource.getRepository(ProductSituation);

    const productSituations = [
        "Ativo",
        "Inativo",
        "Descontinuado",
    ];

    for (const name of productSituations) {

        const existingSituation = await productSituationRepository.findOne({
            where: { name }
        });

        if (!existingSituation) {

            await productSituationRepository.save({ name });

            console.log(`Situação ${name} cadastrada com sucesso!`);

        } else {

            console.log(`Situação ${name} já existe. Nenhuma alteração realizada!`);

        }
    }
}
