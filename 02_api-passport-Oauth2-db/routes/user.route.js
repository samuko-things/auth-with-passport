const express = require("express");
const router = express.Router(); //create an express router middleware
const {authWithJwt} = require("../middlewares/auth.middleware");
const {
  getAllUsers,
  deleteAllUsers,
  getOneUser,
} = require("../controllers/user.controller");



//---------- USER ROUTES ----------//
router.get("/", getAllUsers);
router.delete("/", deleteAllUsers);
router.get("/get-properties", authWithJwt, getOneUser);
//---------------------------------//


module.exports = {
  router,
}