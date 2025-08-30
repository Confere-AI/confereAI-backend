const { TYPES } = require("tedious");
const { logoutServices } = require("../auth/logout.service");

async function createUser(params) {
  try {
    const connection = await connectToDB();
    const sql = await execSql(
      connection,
      "INSERT INTO users (name, email, password_hash) VALUES (@name, @email, @password_hash)",
      {
        "@name": { type: TYPES.NVarChar, value: params.name },
        "@email": { type: TYPES.NVarChar, value: params.email },
        "@password_hash": { type: TYPES.NVarChar, value: params.password_hash },
      }
    );
    console.log("User created:", sql);
    connection.close();
  } catch (err) {
    console.error("Erro:", err);
  }
}

async function signInUserWithJwt(params) {
  let connection = null;
  try {
    connection = await connectToDB();
    let user = null;
    if (params.email) {
      const sql = await execSql(
        connection,
        "SELECT * FROM users WHERE email = @email",
        {
          "@email": { type: TYPES.NVarChar, value: params.email },
        }
      );
      user = sql[0] || null;
    } else if (params.name) {
      const sql = await execSql(
        connection,
        "SELECT * FROM users WHERE name = @name",
        {
          "@name": { type: TYPES.NVarChar, value: params.name },
        }
      );
      user = sql[0] || null;
    }
    return user;
  } catch (err) {
    console.error("Erro:", err);
    return null;
  } finally {
    if (connection) {
      connection.close();
    }
  }
}

async function saveRefreshToken(usuario_id, token, expiracao) {
  try {
    const connection = await connectToDB();
    await execSql(
      connection,
      "INSERT INTO RefreshTokens (usuario_id, token, expiracao) VALUES (@usuario_id, @token, @expiracao)",
      {
        "@usuario_id": { type: TYPES.Int, value: usuario_id },
        "@token": { type: TYPES.NVarChar, value: token },
        "@expiracao": { type: TYPES.DateTime, value: expiracao },
      }
    );
    connection.close();
  } catch (err) {
    console.error("Erro:", err);
  }
}

module.exports = { createUser, signInUserWithJwt, saveRefreshToken };
