// =======================
// Configurações, inicialização do App e Imports
// =======================
import 'dotenv/config';
import createError from "http-errors";
import express from "express";
import db from "./src/utils/config.db.js";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import "reflect-metadata";
import middlewareError from "./src/middlewares/error.middleware.js";
const app = express();
import authRouters from "./src/routes/auth.routes.js";
// ================
// Middlewares Globais
// ================
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cookieParser());
// ================
// Rotas
// ================
app.use("/api/auth", authRouters); // cadastro, login, logout, refresh
//app.use("/api/usuarios", usuarioRouters); // rotas para usuários, ver perfil etc
// =======================
// Tratamento de Erros 404
// =======================
app.use(function (req, res, next) {
  next(createError(404));
});
// =======================
// Middleware de Erro Global
// =======================
app.use(middlewareError);
// =======================
// Tratamento de Exceções Globais
// =======================
process.on("uncaughtException", (err) => {
  console.error("Erro não tratado:", err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.error("Promessa rejeitada sem catch:", err);
  process.exit(1);
});
// =======================
// Inicialização do Servidor e do Banco de Dados
// =======================
db.connect() // Conectando ao banco de dados
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});