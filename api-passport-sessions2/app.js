const express = require("express");
const session = require("express-session");
const {v4 : uuidv4} = require("uuid");
const FileStore = require("session-file-store")(session);
// const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


const app = express();
const router = express.Router(); //create an express router middleware


//---- make a dummy user ----------//
const users = require("./users.json");
//---------------------------------//




//---------- ROUTES ---------------//
router.get("/", (req,res) => {
  return res.status(200).json({
    success:true,
    message:"Home Page",
    data: {
      current_user: req.user,
      user_isAuth: req.isAuthenticated()
    }
  });
});

router.get("/success", (req, res) => {
  return res.status(200).json({
    success:true,
    message:"Congrats, You've successfully signed up (logged in)",
    data:{
      req_user: req.user,
      req_isAuth: req.isAuthenticated(),
      // req_login: req.logIn(),
      // req_logout:req.logOut()
    }
  });
})

router.get("/failed", (req, res) => {
  return res.status(400).json({
    success:false,
    message:req.session.messages
    // message:"LOGIN FAILED ROUTE"
  });
})

router.post("/signup",passport.authenticate("local-signup", {
  // session: false,
  successRedirect: "/success",
  failureRedirect: "/failed",
}))

router.post("/login",passport.authenticate("local-login", {
  // session: false,
  successRedirect: "/success",
  failureRedirect: "/failed",
}))

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
})

router.get("/auth", (req, res, next) => {
  if(req.isAuthenticated()){
    return res.status(200).json({
      success:true,
      message:`Welcome [${req.user.username}] to the Secure route`,
    });
  }
  const myErr = new Error("Unauthorized to access this route");
  return next(myErr);
})
//---------------------------------//




//---------- APP SETUP -------------//
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json());

app.use(session({
  genid: (req) => {
    // console.log("genID req.sessionID: ", req.sessionID)
    return uuidv4();
  },
  store: new FileStore(),
  secret: "a private key",
  resave: false,
  saveUninitialized: false, // only save when the session is updated
}));

app.use(passport.initialize());

// passport session
app.use(passport.session());
passport.serializeUser((user, done) => {
  console.log("serializing User ...");
  return done(null, user);
})
passport.deserializeUser((user, done) => {
  console.log("deserializing User ...");
  return done(null, user);
})
////////////////////

passport.use("local-signup", new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password"
  },
  async (username, password, done) => {
    try {
      if(password.length <= 4 || !username){
        const myErr = new Error("Your Credentials does not match our criteria");
        return done(myErr);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: uuidv4(),
        username: username,
        password: hashedPassword
      };
      users.push(newUser);
      await fs.writeFile("users.json", JSON.stringify(users), (err)=>{
        if (err){
          return done(err);
        }
        console.log("updated the fake database");
      });

      return done(null, newUser);
      
    } catch (err) {
      return done(err);
    }
  }
))

passport.use("local-login", new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password"
  },
  async (username, password, done) => {
    try {
      const user = users.find((user)=> user.username === username);
      if (!user){
        const myErr = Error("Invalid Credentials [username]");
        return done(myErr);
      }
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches){
        const myErr = Error("Invalid Credentials [password]");
        return done(myErr);
      }
      done(null, user);

    } catch (err) {
      return done(err);
    }
  }
))
//----------------------------------//




//-------- ROUTER(s) ----------------//
app.use(router);
//-----------------------------------//



//---------- ERROR HANDLING ---------//
app.use((req, res, next) => {
  const error = new Error('ROUTE NOT FOUND !!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    success:false,
    message:`ERROR: ${error.message}`,
  });
});
//-----------------------------------//




//---------- SERVER START -----------//
const portNo = 3030;
app.listen(portNo, () => {
  console.log(`server started on port ${portNo}`)
})
//-----------------------------------//
