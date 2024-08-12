const express = require("express");
const router = express.Router(); //create an express router middleware
const {authWithJwt} = require("../middlewares/auth.middleware");
const {
  home,
  getAllUsers,
  deleteAllUsers,
  getOneUser,
} = require("../controllers/user.controller");



//---------- USER ROUTES ----------//
router.get("/", home);
router.delete("/delete-all", deleteAllUsers);
router.get("/get-all", getAllUsers);
router.get("/get-one", authWithJwt, getOneUser);
//---------------------------------//


module.exports = {
  router,
}