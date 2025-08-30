require("dotenv").config();  // essa variável contém as opções de configuração do pg-promise
const pgp = require("pg-promise")(); // Inicializa pg-promise corretamente
const connectionString = process.env.DATABASE_URL;
const connectToDatabase = pgp(connectionString); // Cria o objeto de banco de dados

connectToDatabase.connect()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });

module.exports = {
  connectToDatabase
};