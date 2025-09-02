import { signUpNormalService } from "../auth/auth.service.js";
//import * as Logout from "../auth/logout.service.js";
import bcrypt from "bcrypt";
//import jwt from "jsonwebtoken";

async function signUpNormal(req, res) { // essa função é para cadastro normal, sem OAuth
    try {
        const { email, name, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
        await signUpNormalService({ email, name, password: hashedPassword });
        res.status(201).json({ message: "Usuario criado" });
    } catch (err) {
        console.error("Erro:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { signUpNormal };