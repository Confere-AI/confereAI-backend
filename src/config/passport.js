import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: false
};

passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    console.log('JWT payload:', jwt_payload);
    console.log('Expiration time:', new Date(jwt_payload.exp * 1000).toLocaleString());
    console.log('Current time:', new Date().toLocaleString());
    done(null, jwt_payload);
  })
);

export default passport;