const passport = require("passport");

const authWithJwt = (req, res, next) => {
  passport.authenticate("jwt", {session: false},
  (err, payload, info) => {
    if (err) {
      return next(err);
    }

    if (info) {
      const myErr = new Error(info.message);
      return next(myErr);
    }

    if (!payload) {
      const myErr = new Error("[UNAUTHORIZED] Unknown User Trying to Access This Route\nRedirecting To Login Page");
      return next(myErr);
    }
    
    const { _id, username} = payload;
    req.user = { _id: _id, username: username}; // replace the req.user parameter with the payload
    return next();
  }) (req, res, next)
};

const authWithGoogle = (req, res, next) => {
  passport.authenticate('google', { scope: ['email', 'profile'] },
  () => {
  }) (req, res, next)
};

const authWithGithub = (req, res, next) => {
  passport.authenticate('github', { scope: ['email'] },
    // passport.authenticate('github', { scope: [ 'user:email' ] },
  () => {
  }) (req, res, next)
};

module.exports = {
  authWithJwt,
  authWithGoogle,
  authWithGithub
}