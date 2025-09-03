import db from "../utils/config.db.js";

async function selectUsers() {
  try {
    const result = await db.any("SELECT * FROM usuario");
    if (result.length === 0) {
      throw new Error("Nenhum usuario.");
    }
    return result; // vai retornar todos os usuarios
  } catch (error) {
    console.error("Erro ao buscar usuarios ", error);
  }
}

export { selectUsers };