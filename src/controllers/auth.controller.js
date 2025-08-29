const e = require("express");
const AuthService = require("../auth/auth.service");
const Logout = require("../auth/logout.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body; // extraindo os dados do corpo da requisição
    const password_hash = await bcrypt.hash(password, 10);
    await AuthService.createUser({ name, email, password_hash }); //
    res.status(201).json({ message: "Usuario criado" });
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function signIn(req, res) {
  try {
    if ((req.body.name || req.body.email) && req.body.password) {
      const { email, name, password } = req.body;
      const user = await AuthService.signInUserWithJwt({ email, name });
      if (user && user.password_hash) {
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) {
          const tokenJwt = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            {
              expiresIn: parseInt(process.env.JWT_EXPIRES),
            }
          );
          const refreshToken = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            {
              expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES),
            }
          );
          const expiracao = new Date(
            Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES) * 1000
          );
          await AuthService.saveRefreshToken(user.id, refreshToken, expiracao);
          return res
            .status(200)
            .json({
              token: tokenJwt,
              refreshToken,
              expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES),
            }); // payload do JWT
        }
      }
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body; // pega o refreshToken do cabeçalho da requisição
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token é obrigatório" });
    }
    const isBlacklisted = await Logout.isTokenBlacklisted(refreshToken);
    if (isBlacklisted) {
      return res.status(401).json({ error: "Refresh token inválido" });
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET); // verifica o refresh token
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

async function logoutUser(req, res) {
  try {
    const { userId, refreshToken } = req.body;
    if (!userId || !refreshToken) {
      console.error("Usuário e refreshToken são obrigatórios");
      return res
        .status(400)
        .json({ error: "Usuário e refreshToken são obrigatórios" });
    }
    await Logout.logout(userId, refreshToken); // chama a função de logout
    res.status(200).json({ message: "Logout efetuado com sucesso" });
    console.log("Logout efetuado com sucesso");
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { createUser, signIn, refreshToken, logoutUser };
