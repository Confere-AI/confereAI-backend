import redisClient, { connectRedis } from "../config/redis.js";
import { getDeviceInfo } from "../services/user.service.js";

export async function setRefreshTokens(userId, refreshToken, expiresAt, userAgent) {
  let device = await getDeviceInfo(userAgent)
  const tokenId = extractJTI(refreshToken) || refreshToken;
  const data = JSON.stringify({
    token: refreshToken,
    expiresAt,
    createdAt: new Date().toISOString(),
    device: device
  });
  const key = `refresh_tokens:${userId}`;
  let ttl = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
  if (ttl <= 0) ttl = 1; // Garantir que o TTL seja positivo
    try {
      await connectRedis();
      const saveToken = await redisClient.hSet(key, tokenId, data);
      const saveExpire = await redisClient.expire(key, ttl);
      if (saveToken === 0 || saveExpire === 0) {
        throw new Error("Impossivel alocar no redis.");
      }
      console.log("Token salvo no Redis com sucesso.", {
        userId,
        tokenId,
        key,
        ttl,
        device
      });
      return { saveToken, saveExpire };
    } catch (err) {
      console.error(`Erro ao salvar token no Redis:`, err);
      throw err;
    }
}

function extractJTI(token) {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return payload.jti;
  } catch (error) {
    console.error("Erro ao extrair JTI:", error);
    return null;
  }
}

export async function getRefreshTokens(userId) {
    const key = `refresh_tokens:${userId}`;
    try {
        await connectRedis();
        const tokens = await redisClient.hGetAll(key); // Obter todos os tokens do usuário
        const parsedTokens = Object.entries(tokens).map(([tokenId, data]) => ({
            tokenId,
            ...JSON.parse(data)
        }));
        return parsedTokens;
    } catch (error) {
        console.error("Erro ao obter tokens do Redis:", error);
        throw error;
    }
}