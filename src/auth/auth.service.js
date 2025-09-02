//const { logoutServices } = require("../auth/logout.service");
import { insertSignUp } from '../queries/inserts.js';

async function signUpNormalService(params) {
  try {
    const query = await insertSignUp(params);
    console.log("User created:", query);
  } catch (err) {
    console.error("Erro:", err);
  }
}

//async function signInUserWithJwt(params) {
//  let connection = null;
//  try {
//    connection = await connectToDB();
//    let user = null;
//    if (params.email) {
//      const sql = await execSql(
//        connection,
//        "SELECT * FROM users WHERE email = @email",
//        {
//          "@email": { type: TYPES.NVarChar, value: params.email },
//        }
//      );
//      user = sql[0] || null;
//    } else if (params.name) {
//      const sql = await execSql(
//        connection,
//        "SELECT * FROM users WHERE name = @name",
//        {
//          "@name": { type: TYPES.NVarChar, value: params.name },
//        }
//      );
//      user = sql[0] || null;
//    }
//    return user;
//  } catch (err) {
//    console.error("Erro:", err);
//    return null;
//  } finally {
//    if (connection) {
//      connection.close();
//    }
//  }
//}
//
//async function saveRefreshToken(usuario_id, token, expiracao) {
//  try {
//    const connection = await connectToDB();
//    await execSql(
//      connection,
//      "INSERT INTO RefreshTokens (usuario_id, token, expiracao) VALUES (@usuario_id, @token, @expiracao)",
//      {
//        "@usuario_id": { type: TYPES.Int, value: usuario_id },
//        "@token": { type: TYPES.NVarChar, value: token },
//        "@expiracao": { type: TYPES.DateTime, value: expiracao },
//      }
//    );
//    connection.close();
//  } catch (err) {
//    console.error("Erro:", err);
//  }
//}

export { signUpNormalService };