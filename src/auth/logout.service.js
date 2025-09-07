import { selectTokenRefresh, insertBlacklist } from "../queries/selects.js";

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
  try {
    const result = await insertBlacklist(userId, token);
    return result
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