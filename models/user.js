const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
mongoose.Promise = require('bluebird');


mongoose.connect("mongodb://localhost:27017/creating_a_snippet");

///////////////how this user will be set up
const userSchema = new mongoose.Schema ({
    username: { type: String , required: true, unique: true, lowercase: true},
    passwordHash: {type:String, require:true },

});

//////////////////////////////////////////
userSchema.virtual('password')
   .get(function() {
       return null
   })
   .set(function(value) {
       const hash = bcrypt.hashSync(value, 8);
       this.passwordHash = hash;
   })

userSchema.methods.authenticate = function (password) {
 return bcrypt.compareSync(password, this.passwordHash);
}

userSchema.statics.authenticate = function(username, password, done) {
   this.findOne({
       username: username
   }, function(err, user) {
       if (err) {
           done(err, false)
       } else if (user && user.authenticate(password)) {
           done(null, user)
       } else {
           done(null, false)
       }
   })
};
////////////////////////////////////////


const user = mongoose.model("user",userSchema);   //"User" thats in the parenthesis is the db collection name


module.exports = user;
