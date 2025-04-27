import * as dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import passportJWT, { VerifiedCallback } from "passport-jwt";
import { db } from "./db.js";

const { SECRET } = process.env;
if (!SECRET) {
  throw new Error("Missing SECRET environment variable");
}

passport.use(
  new passportJWT.Strategy(
    {
      secretOrKey: SECRET,
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload: any, done: VerifiedCallback) => {
      try {
        const user = await db.one(`SELECT * FROM users WHERE id=$1`, [
          payload.id,
        ]);
        console.log(user);
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(null, false);
      }
    }
  )
);
