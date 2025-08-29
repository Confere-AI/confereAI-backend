// =======================
// Configurações, inicialização do App e Imports
// =======================
require("dotenv-safe").config();
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const middlewareError = require('./src/middlewares/error.middleware');
const authMiddleware = require('./src/middlewares/auth.middleware').authMiddleware;
require('./src/config/passport');
const app = express();
// ================
// Middlewares Globais
// ================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// ================
// Rotas
// ================
const usersRouter = require('./src/routes/user.routes');
const authRouters = require('./src/routes/auth.routes');
const groupRouters = require('./src/routes/groups.routes');
app.use('/api/auth', authRouters); // cadastro, login, logout, refresh
app.use('/api/users', authMiddleware, usersRouter);
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
// Inicialização do Servidor
// =======================
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});