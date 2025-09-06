import { r } from "tar";
import { signUpNormalService } from "../auth/auth.service.js";
//import * as Logout from "../auth/logout.service.js";
import bcrypt from "bcrypt";
import { is } from "bluebird";
import jwt from "jsonwebtoken";

async function signUpNormal(req, res) { // essa função é para cadastro normal, sem OAuth
  try {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await signUpNormalService({ email, name, password: hashedPassword });
    if (!result) {
        res.status(400).json({ error: "Não foi possivel se cadastrar" }
      );
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
    const user = await signInNormalService({ email, name });
    if (user && user.hashedPassword) {
      const isMatch = await bcrypt.compare(password, user.hashedPassword);
      if (isMatch) {
        const tokenJwt = jwt.sign(
          { id: user.id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: parseInt(process.env.JWT_EXPIRES)
          }
        );
        const refreshTokenJwt = jwt.sign(
          { id: user.id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES)
          }
        );
        const expiracao = new Date(
          Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES) * 1000
        );
        await saveRefreshToken(user.id, refreshToken, expiracao);
//        return res.status(200).json({
//          token: tokenJwt,
//          refreshTokenJwt,
//          expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES)
//        });
      }
    }
    return res.status(401).json({ error: "Credenciais inválidas" });
  } catch (error) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { signUpNormal, signInNormal };