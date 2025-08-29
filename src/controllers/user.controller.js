const UserService = require("../services/user.service");

async function getUsers(req, res) {
  try {
    const users = await UserService.getUsers();
    res.json(users);
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getUserById(req, res) {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario não encontrado" });
    }
    res.json(user);
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


async function myProfile(req, res) {
  try {
    // Usa o id do usuário autenticado, não req.params.id
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Login expirado, entre novamente!" });
    }
    const me = await UserService.myProfile(userId);
    if (!me) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json(me);
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
} 

module.exports = {
  getUsers,
  getUserById,
  myProfile
};
