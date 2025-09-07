import db from "../utils/config.db.js";
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

async function selectUsers() {
  try {
    const result = await db.any("SELECT * FROM usuario");
    if (result.length === 0) {
      throw new Error("Nenhum usuario.");
    }
    return result; // vai retornar todos os usuarios
  } catch (error) {
    console.error("Erro ao buscar usuarios ", error);
  }
}

async function selectMe(userId) {
  try {
    const result = await db.one("SELECT * FROM usuario WHERE id = $1", [
      userId,
    ]);
    return result;
  } catch (error) {
    console.error("Erro ao buscar usuario ", error);
  }
}

async function selectLogin(identifier) {
  try {
    const result = await db.one(
      "SELECT * FROM usuario WHERE email = $1 OR name = $1 LIMIT 1",
      [identifier]
    );
    if (!result) {
      throw new Error("Parâmetro invalido para login.");
    }
    return result;
  } catch (error) {
    console.error("Erro ao buscar usuario para login", error);
  }
}

async function selectTokenRefresh(token) {
  try {
    const result = await db.oneOrNone("SELECT 1 FROM refreshtokenblacklist WHERE Token = $1",
      [token]
    );
    return result;
  } catch (error) {
    console.error('Erro ao concluir refresh token', error);
  }
}

export { selectUsers, selectMe, selectLogin, selectTokenRefresh };
