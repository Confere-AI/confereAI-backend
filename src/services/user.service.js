const { connectToDB, execSql } = require('../config/db');
const { TYPES } = require('tedious');

async function getUsers() {
    try {
        const connection = await connectToDB();
        const users = await execSql(connection, 'SELECT * FROM users');
        console.log(users);
        connection.close();
        return users;
    } catch (err) {
        console.error('Erro:', err);
        throw err;
    }
}

async function getUserById(id) {
    try {
        const connection = await connectToDB();
        let paramType, paramValue;
        if (!isNaN(Number(id))) {
            paramType = TYPES.Int;
            paramValue = Number(id);
        } else {
            paramType = TYPES.NVarChar;
            paramValue = String(id);
        }
        const users = await execSql(connection, 'SELECT * FROM users WHERE id = @id', {
            '@id': { type: paramType, value: paramValue }
        });
        connection.close();
        return users[0] || null;
    } catch (err) {
        console.error('Erro:', err);
        throw err;
    }
}

async function myProfile(id) {
    try {
        const numericId = Number(id);
        if (isNaN(numericId)) {
            throw new Error('Invalid user ID');
        }
        const connection = await connectToDB();
        const user = await execSql(connection, 'SELECT * FROM users WHERE id = @id', {
            '@id': { type: TYPES.Int, value: numericId }
        });
        connection.close();
        return user;
    } catch (err) {
        console.error('Erro:', err);
        throw err;
    }
}

module.exports = { getUsers, getUserById, myProfile };