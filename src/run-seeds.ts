import { AppDataSource } from "./data-source.js";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds.js";
import CreateProductCategoriesSeeds from "./seeds/CreateProductCategoriesSeeds.js";

const runSeeds = async () => {
    console.log("Conectando ao Banco de Dados...");

    await AppDataSource.initialize();
    console.log("Banco de Dados Conectado!");

    try {
        // Cria as instâncias das classes de Seeds
        const situationsSeeds = new CreateSituationsSeeds();
        const productCategoriesSeeds = new CreateProductCategoriesSeeds();

        // Executa as Seeds
        await situationsSeeds.run(AppDataSource);
        await productCategoriesSeeds.run(AppDataSource);

    } catch (error) {

        console.log("Erro ao Executar o Seed", error);

    } finally {
        await AppDataSource.destroy();
        console.log("Conexão com Banco de Dados Encerrada.");
    }
};

runSeeds();