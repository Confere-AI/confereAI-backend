import pgPromise from "pg-promise"; // importando pg-promise
import dotenv from "dotenv";
dotenv.config();

const connection = process.env.DATABASE_URL;
const pgp = pgPromise(); // Inicializando pg-promise
const db = pgp(connection); // Criando a conexão com o banco de dados
export default db; // Exportando a conexão do banco de dados