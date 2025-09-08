import {
  signUpNormalService,
  signInNormalService,
} from "../auth/auth.service.js";
import { isTokenBlacklisted, blacklistToken } from "../auth/logout.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signUpNormal(req, res) {
  // essa função é para cadastro normal, sem OAuth
  try {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await signUpNormalService(email, name, hashedPassword);
    if (!result) {
      res.status(400).json({ error: "Não foi possivel se cadastrar" });
    } else {
      res.status(201).json({ message: "Usuario criado" });
    }
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function signInNormal(req, res) {
  try {
    const { email, name, password } = req.body;
    const service = await signInNormalService({ email, name, password });
    if (!service) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    return res.status(200).json(service);
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body; // pega o refreshToken do cabeçalho da requisição
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token é obrigatório" });
    }
    const isBlacklisted = await isTokenBlacklisted(refreshToken);
    if (isBlacklisted) {
      return res.status(401).json({ error: "Refresh token inválido" });
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newAcessToken = jwt.sign(
      { id: payload.id, name: payload.name, email: payload.email },
      process.env.JWT_SECRET,
      { expiresIn: parseInt(process.env.JWT_EXPIRES) }
    );
    res.status(200).json({ token: newAcessToken });
  } catch (err) {
    console.error("Erro refreshToken:", err);
    res.status(403).json({ error: "Refresh token inválido ou expirado" });
  }
}

async function logoutController(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "usuario não está logado" });
    }
    const authHeader = req.get("Authorization");
    const accessToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    const refreshToken = req.body.refreshToken;
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES)
    );
    if (accessToken) {
      await blacklistToken(userId, accessToken, expiresAt);
    }

    if (refreshToken) {
      await blacklistToken(userId, refreshToken, expiresAt);
    }
    res.status(200).json({ success: "Deslogado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro no servidor" });
  }
}

export { signUpNormal, signInNormal, refreshToken, logoutController };
