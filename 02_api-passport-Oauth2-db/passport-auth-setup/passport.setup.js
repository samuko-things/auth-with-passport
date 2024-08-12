const passport = require("passport");
const { localStrategy } = require("./strategy/local.strategy");
const { jwtStrategy } = require("./strategy/jwt.strategy");
const { googleStrategy } = require("./strategy/google.strategy");
const { githubStrategy } = require("./strategy/github.strategy");


const configurePassport =  (app) => {
  passport.use(localStrategy);
  passport.use(jwtStrategy);
  passport.use(googleStrategy);
  passport.use(githubStrategy);
  app.use(passport.initialize());
}


module.exports = {
  configurePassport,
}