const express = require("express");
const router = express.Router(); //create an express router middleware
// const bcrypt = require("bcrypt");
const passport = require("passport");
require("./passportStrategy");
const {UserModel: User} = require("./model");



//---------- ROUTES ---------------//
router.get("/", (req,res) => {
  return res.status(200).json({
    success:true,
    message:"Home Page",
  });
});


router.post("/signup", async (req, res, next) => {
  try {
    const {username, password} = req.body;

    // if(password.length <= 4){
    //   const myErr = new Error("Your password length is too short");
    //   throw myErr;
    // }
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: username,
      password: password
    });
    const savedUser = await user.save();
    console.log("Created new user");

    return res.status(200).json({
      success:true,
      message:"You've successfully signed up",
      data:{
        user: savedUser
      }
    });
    
  } catch (err) {
    return next(err);
  }
})

router.post("/login",passport.authenticate("local-login"), (req, res) => {
  return res.status(200).json({
    success:true,
    message:"You've successfully logged in",
    data:{
      // user: user,
      isAuth: req.isAuthenticated(),
      sessionId: req.session.id,
      session: req.session
    }
  });
})

router.get("/logout", (req, res, next) => {
  if(!req.user){
    const myErr = new Error("No User Found: Logout Failed");
    return next(myErr);
  }
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.status(200).json({
      success:true,
      message:`Logout Successful, Go back to Login Page`,
    });
  });
})

router.get("/auth",(req, res, next) => {
  // console.log(req.session);
  if(req.user){
    return res.status(200).json({
      success:true,
      message:`Welcome [${req.user.username}] to the Secure route`,
    });
  }
  const myErr = new Error("Unauthorized to access this route");
  return next(myErr);
})


router.delete("/delete-all", async (req, res, next) => {
  try {
    const query = await User.deleteMany().exec();
    if (query.deletedCount < 1){
      throw new Error('No record found to be deleted')
    }
    return res.status(200).json({
      success:true,
      message:`All Users deleted successfully`,
    });
  } catch (err) {
    next(err)
  }
})

router.get("/get-all", async (req, res, next) => {
  try {
    const query = await User.find().exec();
    return res.status(200).json({
      success:true,
      message:`${query.length} User(s) found successfully`,
      users: query
    });
  } catch (err) {
    next(err)
  }
})
//---------------------------------//


module.exports = {
  router,
}