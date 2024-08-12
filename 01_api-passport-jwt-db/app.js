const express = require("express");
const mongoose = require("mongoose");
const { router: userRoute } = require("./routes/user.route");
const { router: authRoute } = require("./routes/user.auth.route");
const {configurePassport} = require("./passport-auth-setup/passport.setup");

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
configurePassport(app);
//----------------------------------//



//-------- ROUTER(s) ----------------//
app.use("/user", userRoute);
app.use("/auth", authRoute);
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