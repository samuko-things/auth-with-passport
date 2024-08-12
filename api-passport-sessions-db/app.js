const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
require("./passportStrategy");
const { router } = require("./routes");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

const dotenv = require('dotenv');
dotenv.config();

const app = express();



//------------- CONNECT TO MONGODB AND START SERVER ----------------//
const mongodb_atlas_uri = `${process.env.MONGODB_ATLAS_URI}`
const port_no = process.env.PORT

const connectToDatabaseAndStartServer = async (db_uri, portNo) => {
  try {
    await mongoose.connect(db_uri);
    console.log("Connection to Database was Successful");

    app.listen(portNo, () => {
      console.log(`server started on port ${portNo}`)
    })

  } catch (error) {
    console.log(`ERROR: Could not connect to Database. ${error}`);
    console.log("ERROR: server could not start");
  } 
}

connectToDatabaseAndStartServer(mongodb_atlas_uri, port_no);
//-----------------------------------------------------------------//




//---------- APP SETUP -------------//
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json());
app.use(cookieParser("a private cookie key"));
app.use(session({
  secret: "a private session key",
  resave: false,
  saveUninitialized: false, // only save when the session is updated
  cookie: {
    maxAge: 60000 * 60
  },
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
  }),
}));

app.use(passport.initialize());
app.use(passport.session());
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





