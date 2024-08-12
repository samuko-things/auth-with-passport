const LocalStrategy = require("passport-local").Strategy;
const {UserModel: User} = require("../../models/user.model");


//--------------- local(login) strategy ----------------//
const localSignupStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const createUser = new User({
        email: email,
        password: password,
      });
      const user = await createUser.save();
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