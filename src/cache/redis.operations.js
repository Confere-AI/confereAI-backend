import redisClient, { connectRedis } from "../config/redis.js";
import { getDeviceInfo } from "../services/user.service.js";

export async function setRefreshTokens(
  userId,
  refreshToken,
  expiresAt,
  userAgent
) {
  const tokenId = extractJTI(refreshToken) || refreshToken;
  const data = JSON.stringify({
    token: refreshToken,
    expiresAt,
    createdAt: new Date().toISOString(),
    device: userAgent,
  });
  const key = `refresh_tokens:${userId}-${userAgent}`;
  let ttl = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
  if (ttl <= 0) ttl = 1;
  try {
    await connectRedis();
    const saveToken = await redisClient.HSET(key, tokenId, data);
    const saveExpire = await redisClient.EXPIRE(key, ttl);
    if (saveToken === 0 || saveExpire === 0) {
      throw new Error("Impossivel alocar no redis.");
    }
    console.log("Token salvo no Redis com sucesso.", {
      userId,
      tokenId,
      key,
      ttl,
      userAgent,
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

export async function getRefreshToken(userId, userAgent) {
  const key = `refresh_tokens:${userId}-${userAgent}`;
  try {
    await connectRedis();
    const tokens = await redisClient.HGETALL(key);
    const parsedTokens = Object.entries(tokens).map(([tokenId, data]) => ({
      tokenId,
      ...JSON.parse(data),
    }));
    return parsedTokens;
  } catch (error) {
    console.error("Erro ao obter tokens do Redis:", error);
    throw error;
  }
}