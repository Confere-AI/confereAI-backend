import { insertSignUp, insertRefresh } from "../queries/inserts.js";
import { selectLogin } from "../queries/selects.js";
import {
  getRefreshToken,
  setRefreshTokens,
} from "../cache/redis.operations.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signUpNormalService(email, name, hashedPassword) {
  try {
    const query = await insertSignUp(email, name, hashedPassword);
    if (!query) {
      throw new Error("Cadastro não realizado.");
    }
    return query;
  } catch (err) {
    console.error("Erro:", err);
  }
}

async function signInNormalService(email, name, password, userAgent) {
  try {
    let user = null;
    const identifier = email || name;
    if (!identifier) {
      throw new Error("Email ou nome é obrigatório.");
    }
    user = await selectLogin(identifier);
    if (!user) {
      throw new Error("Usuario não encontrado.");
    }
    if (user && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const tokenJwt = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            device: userAgent,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: parseInt(process.env.JWT_EXPIRES),
          }
        );
        const refreshTokenJwt = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            device: userAgent,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES),
          }
        );
        const expiracao = new Date(
          Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES) * 1000
        );
        //        await savePgRefreshToken(user.id, refreshTokenJwt, expiracao);
        await saveRedisRefreshToken(
          user.id,
          refreshTokenJwt,
          expiracao,
          userAgent
        );
        return {
          Id: user.id,
          Uuid: user.uuid,
          Email: user.email,
          Name: user.name,
          ExternalId: user.external_id,
          Metadata: user.metadata,
          token: tokenJwt,
          refreshToken: refreshTokenJwt,
          expiracao: expiracao,
        };
      }
    }
  } catch (err) {
    console.error("Erro:", err);
    throw err;
  }
}

async function savePgRefreshToken(userId, refreshToken, expiresAt) {
  try {
    const query = insertRefresh(userId, refreshToken, expiresAt);
    console.log("refresh token add");
    return query;
  } catch (err) {
    console.error("Erro:", err);
  }
}

async function saveRedisRefreshToken(
  userId,
  refreshToken,
  expiresAt,
  userAgent
) {
  try {
    const result = await setRefreshTokens(
      userId,
      refreshToken,
      expiresAt,
      userAgent
    );
    return result;
  } catch (error) {
    console.error("Erro ao salvar token no Redis:", error);
    throw error;
  }
}

async function searchRefreshToken(userId, userAgent) {
  try {
    const result = await getRefreshToken(userId, userAgent);
    if (!result) {
      throw new Error(
        "Houve erro na busca do refresh token associado ao usuario e dispositivo."
      );
    }
    return result;
  } catch (err) {
    console.log("Erro:", err);
    throw err;
  }
}

async function validateRefreshToken(refreshToken) {
  const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const newAcessToken = jwt.sign(
    { id: payload.id, name: payload.name, email: payload.email },
    process.env.JWT_SECRET,
    { expiresIn: parseInt(process.env.JWT_EXPIRES) }
  );
  return newAcessToken;
}

export {
  signUpNormalService,
  signInNormalService,
  saveRedisRefreshToken,
  searchRefreshToken,
  validateRefreshToken,
};
