
import { AppDataSource } from "./data-source.js";

import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds.js";
import CreateUsersSeeds from "./seeds/CreateUsersSeeds.js";

import { CreateProductCategoriesSeeds } from "./seeds/CreateProductCategoriesSeeds.js";
import { CreateProductsSeeds } from "./seeds/CreateProductsSeeds.js";
import { CreateProductSituationsSeeds } from "./seeds/CreateProductSituationsSeeds.js";

async function runSeeds() {
    try {
        await AppDataSource.initialize();

        await new CreateSituationsSeeds().run(AppDataSource);
        await new CreateUsersSeeds().run(AppDataSource);

        await CreateProductCategoriesSeeds();
        await CreateProductSituationsSeeds();
        await CreateProductsSeeds();

        console.log("Seeds executados com sucesso!");
    } catch (error) {
        console.error("Erro ao executar os seeds:", error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

runSeeds();
