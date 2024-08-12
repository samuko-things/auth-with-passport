const express = require("express");
const cookieParser = require("cookie-parser")
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
  });
});


router.post("/signup", async (req, res, next) => {
  try {
    const {username, password} = req.body;

    if(password.length <= 4 || !username){
      const myErr = new Error("Your Credentials does not match our criteria");
      throw myErr;
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
        throw err;
      }
      console.log("updated the fake database");
    });

    return res.status(200).json({
      success:true,
      message:"You've successfully signed up",
      data:{
        user: newUser
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

// router.post("/login",(req, res, next) => {
//   passport.authenticate("local-login", async (err, user, info) => {
//     if(err) {
//       return next(err);
//     }
//     if(user) {
//       req.logIn(user, (err) => {
//         if (err) {return next(err);}
//       });

//       return res.status(200).json({
//         success:true,
//         message:"You've successfully logged in",
//         data:{
//           // user: user,
//           isAuth: req.isAuthenticated(),
//           sessionId: req.session.id,
//           session: req.session
//         }
//       });
//     }
//   })(req, res, next);
// })

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
//---------------------------------//




















//---------- APP SETUP -------------//
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json());
app.use(cookieParser("a private cookie key"));
app.use(session({
//   genid: (req) => {
//     // console.log("genID req.sessionID: ", req.sessionID)
//     return uuidv4();
//   },
  store: new FileStore(),
  secret: "a private session key",
  resave: false,
  saveUninitialized: false, // only save when the session is updated
  cookie: {
    maxAge: 60000 * 60
  }
}));


app.use(passport.initialize());


// passport session
app.use(passport.session());
passport.serializeUser((user, done) => {
  console.log("serializing User ...");
  return done(null, user.id);
})
passport.deserializeUser((id, done) => {
  console.log("deserializing User ...");
  try {
    const user = users.find((user)=>user.id === id)
    if (!user) {throw new Error("User not found")};
    done(null, user);
  } catch (err) {
    done(err, null);
  }
})
////////////////////


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
        throw myErr;
      }
      const passwordMatches = await bcrypt.compare(password, user.password);
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
