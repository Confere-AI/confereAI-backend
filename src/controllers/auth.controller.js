import { signUpNormalService } from "../auth/auth.service.js";
//import * as Logout from "../auth/logout.service.js";
import bcrypt from "bcrypt";

async function signUpNormal(req, res) {
  // essa função é para cadastro normal, sem OAuth
  try {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await signUpNormalService({
      email,
      name,
      password: hashedPassword,
    });
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

export { signUpNormal, signInNormal };