import { selectUsers, selectMe } from "../queries/selects.js";

async function getUsers() {
  try {
    const usuarios = await selectUsers();
    return usuarios;
  } catch (err) {
    console.error("Erro ao selecionar usuários:", err.message);
    throw err;
  }
}

async function myProfileService(userId) {
    try {
        if (!userId) {
            throw new Error('Id do usuario obrigatorio.');
        }
        const getMe = await selectMe(userId);
        if (!getMe) {
            throw new Error('Não foi possivel encontrar seu perfil.');
        }
        const { senha, ...userSafeData } = getMe; // Remover campos sensíveis antes de retornar
        return userSafeData;
    } catch (err) {
        console.error("Erro ao selecionar usuário:", err.message);
        throw err;
    }
}

export { getUsers, myProfileService };