const GithubStrategy = require('passport-github2').Strategy;
// const {UserModel: User} = require("../../models/user.model");

const dotenv = require('dotenv');
dotenv.config();

//--------------- google auth2.0 strategy ----------------//
const githubStrategy = new GithubStrategy(
  {
    clientID: `${process.env.GITHUB_CLIENT_ID}`,
    clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
    callbackURL: "http://localhost:8080/user/auth/github/callback",
  },
  async (accessToken, refreshToken, user_profile, done) => {
    try {
      // save user to database if user does not exit in your Database
      console.log(user_profile._json);
      console.log(`GITHUB_ACCESS_TOKEN: ${accessToken}`);
      // console.log(`REFRESH_TOKEN: ${refreshToken}`);
      done(null, user_profile);

    } catch (err) {
      return done(err);
    }
  }
)
//-----------------------------------------------------//


module.exports = {
  githubStrategy,
}