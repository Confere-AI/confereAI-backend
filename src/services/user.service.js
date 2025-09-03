import { selectUsers } from '../queries/selects.js';

async function getUsers() {
    try {
        const usuarios = await selectUsers();
        return usuarios;
    } catch (err) {
        console.error('Erro ao selecionar usuários:', err.message);
        throw err;
    }
}

export { getUsers };