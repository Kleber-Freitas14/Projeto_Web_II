
import { AppDataSource } from "./data-source.js";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds.js";
import CreateProductCategoriesSeeds from "./seeds/CreateProductCategoriesSeeds.js";
import CreateProductsSeeds from "./seeds/CreateProductsSeeds.js";
import CreateProductSituationsSeeds from "./seeds/CreateProductSituationsSeeds.js";
import CreateUsersSeeds from "./seeds/CreateUsersSeeds.js";

const runSeeds = async () => {
    try {
        console.log("Conectando ao Banco de Dados...");

        await AppDataSource.initialize();

        console.log("Banco de Dados Conectado!");

        // Cria as instâncias das classes de Seeds
        const situationsSeeds = new CreateSituationsSeeds();
        const userSeeds = new CreateUsersSeeds();
        const productCategoriesSeeds = new CreateProductCategoriesSeeds();
        const productsSeeds = new CreateProductsSeeds();
        const createProductSituationsSeeds = new CreateProductSituationsSeeds();

        // Executa as Seeds
        await situationsSeeds.run(AppDataSource);
        await userSeeds.run(AppDataSource);
        await productCategoriesSeeds.run(AppDataSource);
        await productsSeeds.run(AppDataSource);
        await createProductSituationsSeeds.run(AppDataSource);

        console.log("Todas as Seeds foram executadas com sucesso!");

    } catch (error) {
        console.log("Erro ao Executar o Seed", error);

    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log("Conexão com Banco de Dados Encerrada.");
        }
    }
};

runSeeds();
