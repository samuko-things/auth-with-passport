const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const collectionName = 'user';

const UserSchema = mongoose.Schema({
  auth_id: { type: mongoose.Schema.Types.String},
  username: { type: mongoose.Schema.Types.String, required: true, unique: true },
  email: { type: mongoose.Schema.Types.String, required: true, unique: true },
  password: { type: mongoose.Schema.Types.String, required: true, minlength: 5 },
});



UserSchema.pre('save', async function(next){
  // Only run this function if password was moddified (not on other update functions)
  if (!this.isModified("password")){
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  return next();
})

// comparing password during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
}

// // generating token during registration and logging in
// UserSchema.methods.generateToken = function (): string {
//   const token = jwt.sign(
//     {_id: this._id, username: this.username, role: this.role},
//     `${process.env.JWT_SECRET}`,
//     {expiresIn: `${process.env.JWT_LIFETIME}`});
//   return token;
// }



const UserModel = mongoose.model(collectionName, UserSchema); //declare collection name a second time to prevent mongoose from pluralizing or adding 's' to the collection name

module.exports = {
  UserModel
}