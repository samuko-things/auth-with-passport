const jwt = require("jsonwebtoken");
const passport = require("passport");
const {UserModel: User} = require("../models/user.model");

const dotenv = require('dotenv');
dotenv.config();

const loginUser = (req, res, next) => {
  passport.authenticate("local-login", {session: false},
  (err, user, info) => {
    if (err) {
      const myErr = new Error("[UNAUTHORIZED] Cannot Login Unregistered User");
      return next(myErr);
    }

    const token = jwt.sign(
      {_id: user._id, email: user.email},
      `${process.env.JWT_SECRET}`,
      {expiresIn: `${process.env.JWT_LIFETIME}`}
    );

    console.log("LOGIN SUCCESSFUL");
    return res.status(200).json({
      success:true,
      message:"LOGIN SUCCESSFUL",
      data:{
        token: token
      }
    });
  }) (req, res, next)
};


const signupUser = (req, res, next) => {
  passport.authenticate("local-signup", {session: false},
  (err, user, info) => {
    if (err) {
      return next(err);
    }

    const token = jwt.sign(
      {_id: user._id, email: user.email},
      `${process.env.JWT_SECRET}`,
      {expiresIn: `${process.env.JWT_LIFETIME}`}
    );

    console.log("SIGNUP SUCCESSFUL");
    return res.status(200).json({
      success:true,
      message:"SIGNUP SUCCESSFUL",
      data:{
        user: {
          id: user._id,
          email: user.email,
        },
        token: token
      }
    });
  }) (req, res, next)
};


module.exports = {
  loginUser,
  signupUser,
}