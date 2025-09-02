import db from "../utils/config.db.js";

async function insertSignUp({ email, name, password }) {
    try {
        const result = await db.none(
            'INSERT INTO usuario (email, name, password) VALUES ($1, $2, $3)', [email, name, password]);
        return result;
    } catch (error) {
        console.error("Error inserting user:", error);
    }
}

export { insertSignUp };