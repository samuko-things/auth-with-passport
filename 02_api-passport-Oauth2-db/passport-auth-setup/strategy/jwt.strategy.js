const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const dotenv = require('dotenv');
dotenv.config();



//--------------- JWT strategy ----------------//
const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (payload, done) => {
    try {
      done(null, payload);
    } catch (err) {
      return done(err);
    }
  }
)
//-----------------------------------------------------//


module.exports = {
  jwtStrategy,
}