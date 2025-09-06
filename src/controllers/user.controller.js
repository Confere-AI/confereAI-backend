import { userService } from '../services/user.service';

async function myProfile(req, res) {
    try {
        const userId = req.user && req.user.id; // o id será passado na requisição
        if (!userId) { // se não for passado um userId
            return res.status(401).json({ error: "Login expirado, entre novamente!" }); // erro 401
        }
        const me = await userService.myProfile(userId); // caso contrario, me será o usuario
        if (!me) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.json(me); // retorna em json os dados do usuario
    } catch (err) {
        console.error("Erro:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { myProfile };