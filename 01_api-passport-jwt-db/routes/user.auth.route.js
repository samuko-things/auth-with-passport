const express = require("express");
const router = express.Router(); //create an express router middleware
const {signupUser, loginUser} = require("../controllers/user.auth.controller");


//-------- AUTH (SIGNUP AND LOGIN) ROUTES ----------//
router.post("/signup", signupUser);
router.post("/login", loginUser);
//--------------------------------------------------//

module.exports = {
  router,
}