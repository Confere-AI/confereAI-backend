const { Strategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const { connectToDB, execSql } = require('../config/db');
const userService = require('../services/user.service');
const { Request, TYPES } = require('tedious');
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // essa linha
    secretOrKey: process.env.JWT_SECRET
};

async function jwtVerify(payload, done) {
    try {
        let user = await userService.getUserById(payload.id); // utilizando de função propria do service e passando o id do payload
        user = user.email === payload.email ? user : null; // verifica se o email do usuario corresponde ao email do payload
        if (!user) {
            return done(null, false); // usuário não encontrado
        }
        else {
            return done(null, user); // usuário encontrado
        }
    } catch (err) {
        return done(err, false);
    }
}

const jwtStrategy = new Strategy(jwtOptions, jwtVerify);
passport.use('jwt', jwtStrategy);