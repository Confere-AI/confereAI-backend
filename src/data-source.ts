import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import * as dotenv from "dotenv"
config()

function config() {
    dotenv.config()
}
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, // é mais seguro usar variáveis de ambiente
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})