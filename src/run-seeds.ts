import { waitForDebugger } from "node:inspector";
import { AppDataSource } from "./data-source.js"
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds.js";

const runSeeds = async() =>{
    console.log("Conectando ao Banco de Dados...")

    await AppDataSource.initialize();
    console.log("Bandco de Dados Conectado!");

    try{
        //Cria a instância da classes e Seeds

        const situationsSeeds = new CreateSituationsSeeds();

        // Executa as Seeds
        await situationsSeeds.run(AppDataSource);

    }catch(error){

        console.log("Erro ao Executar o Seed", error);

    }finally{
        await AppDataSource.destroy();
        console.log("Conexão com Banco de Dados Encerrada.");
    }
    
};

runSeeds();