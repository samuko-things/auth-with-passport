const passport = require("passport");
const {localStrategy} = require("./strategy/local.strategy");
const {jwtStrategy} = require("./strategy/jwt.strategy");


const configurePassport =  (app) => {
  passport.use(localStrategy);
  passport.use(jwtStrategy);
  app.use(passport.initialize());
}


module.exports = {
  configurePassport,
}