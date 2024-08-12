const express = require("express");
const router = express.Router(); //create an express router middleware
const {
  signupUser,
  loginUser,
  signupOrLoginWithGoogle,
  signupOrLoginWithGithub,
} = require("../controllers/user.auth.controller");


//-------- AUTH (SIGNUP AND LOGIN) ROUTES ----------//
// const passport = require("passport");
// router.get("/github", passport.authenticate('github', { scope: [ 'user:email' ] }));

const { authWithGithub } = require("../middlewares/auth.middleware")
router.get("/github", authWithGithub);
router.get("/github/callback", signupOrLoginWithGithub);


// const passport = require("passport");
// router.get("/google", passport.authenticate('google', { scope: ['email', 'profile'] }));

const { authWithGoogle } = require("../middlewares/auth.middleware")
router.get("/google", authWithGoogle);
router.get("/google/callback", signupOrLoginWithGoogle);

router.post("/signup", signupUser);
router.post("/login", loginUser);
//--------------------------------------------------//

module.exports = {
  router,
}