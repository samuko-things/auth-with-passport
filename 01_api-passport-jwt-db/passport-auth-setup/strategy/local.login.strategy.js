const LocalStrategy = require("passport-local").Strategy;
const {UserModel: User} = require("../../models/user.model");


//--------------- local(login) strategy ----------------//
const localLoginStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({email: email});
      if (!user){
        const myErr = Error("Invalid Credentials [username]");
        throw myErr;
      }
      const passwordMatches = await user.comparePassword(password);
      if (!passwordMatches){
        const myErr = Error("Invalid Credentials [password]");
        throw myErr;
      }
      done(null, user);

    } catch (err) {
      return done(err);
    }
  }
)
//-----------------------------------------------------//


module.exports = {
  localStrategy,
}