import { selectTokenRefresh } from "../queries/selects.js";
import { insertBlacklist } from "../queries/inserts.js";

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

async function blacklistToken(userId, token, expiresAt) {
  try {
    const result = await insertBlacklist(userId, token, expiresAt);
    if (!result) {
      throw new Error('Erro ao fazer logout.');
    }
    return result;
  } catch (err) {
    console.error("Erro:", err);
  }
}

async function isTokenBlacklisted(token) {
  try {
    const result = await selectTokenRefresh(token);
    return !!result;
  } catch (err) {
    console.error("Erro:", err);
    return false;
  }
}

export { logout, blacklistToken, isTokenBlacklisted };
