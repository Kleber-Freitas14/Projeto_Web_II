import "dotenv/config";
import "reflect-metadata"; 
import {Situation} from "./entity/situations.js";
import { User } from "./entity/users.js";

import { DataSource } from "typeorm";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dialect = process.env.DB_DIALECT ?? "mysql";

export const AppDataSource = new DataSource({
    type: dialect as "mysql",

    host: process.env.DB_HOST ?? "localhost",

    port: process.env.DB_PORT
        ? parseInt(process.env.DB_PORT, 10)
        : 3306,

    username: process.env.DB_USERNAME ?? "root",

    password: process.env.DB_PASSWORD ?? "",

    database: process.env.DB_DATABASE ?? "nodeapi",

    synchronize: false,

    entities: [Situation, User],

    subscribers: [],

    migrations: [
        join(__dirname, "migration", "*.js")
    ],
})

// Criando a inicialização da conexão com o BD
AppDataSource.initialize().then(()=>{
    console.log("Conexão Com o Banco de Dados Realizado Com Sucesso!")
}).catch((error: unknown)=>{
    console.log("Erro Na Conexão Com o Bando de Dados!");
    console.error(error);
});