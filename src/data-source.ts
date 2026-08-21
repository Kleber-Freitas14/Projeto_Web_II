import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

const dialect = process.env.DB_DIALECT ?? "mysql";

export const AppdataSource = new DataSource({
  type: dialect as "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: process.env.DB_PORT
    ? parseInt(process.env.DB_PORT)
    : 3306,
  username: process.env.DB_USERNAME ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_DATABASE ?? "nodeapi",
  synchronize: false,
  entities: [],
  subscribers: [],
  migrations: [],
});