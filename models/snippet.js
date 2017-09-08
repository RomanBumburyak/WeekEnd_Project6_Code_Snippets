const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
mongoose.Promise = require('bluebird');

mongoose.connect("mongodb://localhost:27017/creating_a_snippet");


const snippetSchema = new mongoose.Schema ({
    username: { type: String , required: true, lowercase: true},
    title: {type:String, require:true },
    body: {type: String, required: true},
    optionalNotes: [String],
    language: {type:String, require:true},
    tags: [String],

});


const snippet = mongoose.model("snippet",snippetSchema);


module.exports = snippet;
