import passport from "passport";
import passportJwt from "../config/passport.js";
import { isTokenBlacklisted } from "../auth/logout.service.js";

function authMiddleware(req, res, next) {
  let responseObj = {
    statusCode: 0,
    message: "",
    data: {},
  };
  // Log do token recebido
  const authHeader = req.headers["authorization"]; // essa variavel guarda o token de autorizacao
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
  //  console.log("Authorization header:", token);
  passport.authenticate("jwt", async (err, user, info) => {
    if (err) {
      console.error("Erro no passport.authenticate:", err);
      return next(err);
    }
    const refreshToken = await isTokenBlacklisted(token);
    if (refreshToken) {
      return res.status(401).json({ error: "Refresh token inválido" });
    }
    if (!user) {
      console.warn("Usuário não autenticado. Info:", info);
      responseObj.data = info && info.message ? info.message : "Token inválido";
      responseObj.statusCode = 401;
      responseObj.message = "O usuario não está autorizado";
      return res.status(responseObj.statusCode).json(responseObj);
    } else {
      //      console.log("Usuário autenticado:", user);
      req.user = user;
      return next();
    }
  })(req, res, next);
}

export { authMiddleware };