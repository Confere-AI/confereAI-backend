const { connectToDB, execSql } = require("../config/db");
const { TYPES } = require("tedious");

async function logout(userId, refreshToken) {
  try {
    if (!userId || !refreshToken) {
      throw new Error("userId e refreshToken são obrigatórios para logout.");
    }
    await blacklistToken(userId, refreshToken);
  } catch (err) {
    console.error("Erro:", err);
  }
}

async function blacklistToken(userId, token) {
  let connection = null;
  try {
    connection = await connectToDB();
    await execSql(
      connection,
      "INSERT INTO RefreshTokenBlacklist (UserId, token, ExpiresAt) VALUES (@UserId, @token, @ExpiresAt)",
      {
        "@UserId": { type: TYPES.Int, value: userId },
        "@token": { type: TYPES.NVarChar, value: token },
        "@ExpiresAt": { type: TYPES.DateTime, value: new Date(Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES) * 1000) },
      }
    );
  } catch (err) {
    console.error("Erro:", err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
}

async function isTokenBlacklisted(token) {
  let connection = null;
  try {
    connection = await connectToDB();
    const result = await execSql(
      connection,
      "SELECT 1 FROM RefreshTokenBlacklist WHERE token = @token",
      {
        "@token": { type: TYPES.NVarChar, value: token },
      }
    );
    return result.length > 0;
  } catch (err) {
    console.error("Erro:", err);
    return false;
  } finally {
    if (connection) connection.close();
  }
}

module.exports = { logout, blacklistToken, isTokenBlacklisted };
