const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');



const snippetSchema = new mongoose.Schema ({
    username: { type: String , required: true, unique: true, lowercase: true},
    passwordHash: { type: String, required: true},
    name: {type: String, required: true},
    email: String,
    avatar: String,
    university: String,
    job:String,
    company:String,

});

snippetSchema.virtual('password')
    .get(function() {
        return null
    })
    .set(function(value) {
        const hash = bcrypt.hashSync(value, 8);
        this.passwordHash = hash;
    })

snippetSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
}

snippetSchema.statics.authenticate = function(username, password, done) {
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


const User = mongoose.model("User",profileSchema);   //"User" thats in the parenthesis is the db collection name


module.exports = User;
