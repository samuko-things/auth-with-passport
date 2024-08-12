const jwt = require("jsonwebtoken");
const passport = require("passport");
const { UserModel: User } = require("../models/user.model");

const dotenv = require('dotenv');
dotenv.config();


const signupOrLoginWithGithub = (req, res, next) => {
  passport.authenticate("github", {session: false},
    (err, user_profile, info) => {
      try {
        if (err) {
        // const myErr = new Error("[UNAUTHORIZED] Invalid github user");
          throw err;
      }

      return res.status(200).json({
        success:true,
        user: user_profile
      });
        
      } catch (err) {
        next(err)
      }
  }) (req, res, next)
}

const signupOrLoginWithGoogle = (req, res, next) => {
  passport.authenticate("google", {session: false},
    (err, user_profile, info) => {
      try {
        if (err) {
        // const myErr = new Error("[UNAUTHORIZED] Invalid google user");
          throw err;
      }

      return res.status(200).json({
        success:true,
        user: user_profile
      });
        
      } catch (err) {
        next(err)
      }
  }) (req, res, next)
}

const loginUser = (req, res, next) => {
  passport.authenticate("local", {session: false},
  (err, user, info) => {
    if (err) {
      const myErr = new Error("[UNAUTHORIZED] Cannot Login Unregistered User");
      return next(myErr);
    }

    const token = jwt.sign(
      {_id: user._id, username: user.username},
      `${process.env.JWT_SECRET}`,
      {expiresIn: `${process.env.JWT_LIFETIME}`}
    );
    
    return res.status(200).json({
      success:true,
      message:"LOGIN SUCCESSFUL",
      data:{
        user: {
          id: user._id,
          username: user.username,
        },
        token: token
      }
    });
  }) (req, res, next)
};

const signupUser = async (req, res, next) => {
  try {
    const {username, email, password} = req.body;

    const user = new User({
      username: username,
      email: email,
      password: password
    });
    const savedUser = await user.save();
    console.log("Created new user");

    const token = jwt.sign(
      {_id: savedUser._id, username: savedUser.username},
      `${process.env.JWT_SECRET}`,
      {expiresIn: `${process.env.JWT_LIFETIME}`}
    );

    return res.status(200).json({
      success:true,
      message:"SIGNUP SUCCESSFUL",
      data:{
        user: {
          id: savedUser._id,
          username: savedUser.username,
        },
        token: token
      }
    });
    
  } catch (err) {
    return next(err);
  }
};


module.exports = {
  loginUser,
  signupUser,
  signupOrLoginWithGoogle,
  signupOrLoginWithGithub,
}