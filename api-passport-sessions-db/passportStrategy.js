const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const {UserModel: User} = require("./model");


passport.serializeUser((user, done) => {
  console.log("serializing User ...");
  return done(null, user._id);
})


passport.deserializeUser(async (_id, done) => {
  console.log("deserializing User ...");
  try {
    const user = await User.findById(_id).exec();
    if (!user) {throw new Error("User not found")};
    done(null, user);
  } catch (err) {
    done(err, null);
  }
})


passport.use("local-login", new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password"
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({username: username});
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
))