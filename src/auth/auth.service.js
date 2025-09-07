//const { logoutServices } = require("../auth/logout.service");
// import { use } from "passport";
import { insertSignUp, insertRefresh } from "../queries/inserts.js";
import { selectLogin } from "../queries/selects.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signUpNormalService(params) {
  try {
    const query = await insertSignUp(params);
    console.log("User created:", query);
  } catch (err) {
    console.error("Erro:", err);
  }
}

async function signInNormalService(params) {
  // params é um objeto que contem name e email
  try {
    let user = null;
    const identifier = params.email || params.name;
    if (!identifier) {
      throw new Error("Email ou nome é obrigatório.");
    }
    user = await selectLogin(identifier);
    if (!user) {
      throw new Error("Usuario não encontrado.");
    }
    if (user && user.password) {
      //user.password é a senha hash do banco de dados
      const isMatch = await bcrypt.compare(params.password, user.password);
      if (isMatch) {
        const tokenJwt = jwt.sign(
          { id: user.id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: parseInt(process.env.JWT_EXPIRES),
          }
        );
        const refreshTokenJwt = jwt.sign(
          { id: user.id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES),
          }
        );
        const expiracao = new Date(
          Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES)
        );
        await saveRefreshToken(user.id, refreshTokenJwt, expiracao);
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

async function saveRefreshToken(userId, refreshToken, expiresAt) {
  try {
    const params = {
      usuario_id: userId,
      token: refreshToken,
      expiracao: expiresAt,
    };
    const query = insertRefresh(params);
    console.log("refresh token add");
    return query;
  } catch (err) {
    console.error("Erro:", err);
  }
}

export { signUpNormalService, signInNormalService };
