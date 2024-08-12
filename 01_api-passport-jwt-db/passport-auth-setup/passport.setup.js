const passport = require("passport");
const { localLoginStrategy } = require("./strategy/local.login.strategy");
const { localSignupStrategy } = require("./strategy/local.signup.strategy");
const { jwtStrategy } = require("./strategy/jwt.strategy");


const configurePassport = (app) => {
  passport.use('local-signup',localSignupStrategy);
  passport.use('local-login',localLoginStrategy);
  passport.use(jwtStrategy);
  app.use(passport.initialize());
}


module.exports = {
  configurePassport,
}