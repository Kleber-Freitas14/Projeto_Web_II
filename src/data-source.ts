import "dotenv/config";
import "reflect-metadata";

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

    entities: [],

    subscribers: [],

    migrations: [
        join(__dirname, "migration", "*.js")
    ],
});