const {UserModel: User} = require("../models/user.model");


const home = (req,res) => {
  return res.status(200).json({
    success:true,
    message:"Users Home Page",
  });
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().exec();
    return res.status(200).json({
      success:true,
      message:`${users.length} User(s) found successfully`,
      users: users
    });
  } catch (err) {
    next(err)
  }
}

const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();
    return res.status(200).json({
      success:true,
      message:`User Found`,
      data:{
        user: {
          id: user._id,
          email: user.email,
        }
      }  
    });
  } catch (err) {
    next(err);
  }
}

const deleteAllUsers = async (req, res, next) => {
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
};


module.exports = {
  home,
  getAllUsers,
  getOneUser,
  deleteAllUsers,
}