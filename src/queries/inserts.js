import db from "../config/config.db.js";
import dotenv from "dotenv";
dotenv.config();

// consultas:
//  Métodos por tipo de resultado
//  db.any(query, values) - múltiplos resultados ou nenhum
//  db.one(query, values) - exatamente 1 registro
//  db.oneOrNone(query, values) - Nenhum ou 1 registro
//  db.many(query, values - 1 ou mais registros
//  db.none(query, values) - undefined - Uso: Para INSERT, UPDATE, DELETE(sem retorno)
//  db.manyOrNone(query, values) - Array(0 ou mais registros)

//  Métodos especiais:
//  db.result(query, values) - Objeto Result completo do PostgreSQL
//  db.query(query, values) - Método genérico que retorna o resultado bruto
//  db.stream(query, values) - Para consultas com streaming de dados grandes
//  db.func(funcName, values, qrm) - Para chamar funções do PostgreSQL
//  db.proc(procName, values) - Para chamar stored procedures

async function insertSignUp(email, name, hashedPassword) {
  try {
    await db.none(
      "INSERT INTO usuario (email, name, password) VALUES ($1, $2, $3)",
      [email, name, hashedPassword]
    );
    return true;
  } catch (error) {
    console.error("Error inserting user:", error);
    throw new Error("Erro no cadastro");
  }
}

async function insertRefresh(usuario_id, token, expiracao) {
  try {
    const result = db.none(
      "INSERT INTO refreshtokens (usuario_id, token, expiracao) VALUES ($1,$2,$3)",
      [usuario_id, token, expiracao]
    );
    if (!result) {
      throw new Error("Erro ao salvar refresh roken");
    }
    return result;
  } catch (error) {
    console.error("Error", error);
  }
}

async function insertBlacklist(userId, token, expiresAt) {
  try {
    const result = db.none(
      "INSERT INTO refreshtokenblacklist (UserId, token, expiresat) VALUES ($1, $2, $3)",
      [userId, token, expiresAt]
    );
    return result;
  } catch (error) {
    console.error("erro na inserção na blacklist: ", error);
  }
}

export { insertSignUp, insertRefresh, insertBlacklist };
