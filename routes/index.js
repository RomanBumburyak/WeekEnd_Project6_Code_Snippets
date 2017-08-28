const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');


mongoose.connect("mongodb://localhost:27017/creating_a_snippet");



router.get('/', function(req,res){
  res.redirect("login")
});

router.get("/sign_up", function (req,res) {
  res.render("sign_up");
});

router.post("/sign_up", function(req,res){
  User.create({
    username:req.body.username,
    password:req.body.password,
    name:req.body.name,
    email:req.body.email
  }).then(function(data){
    console.log(data);
    res.redirect("/login");
  })
  .catch(function(err){
    console.log(err);
    res.redirect("/sign_up");
  })
});




/////////////////////////////////////////////////////////
router.get("/login", function (req,res) {
  res.render("login");
});

router.post("/login", passport.authenticate('local', {

    successRedirect:'/listings',
    failureRedirect: '/login',
    failureFlash: true
}));




///////////////////////////////////////////

router.get('/editProfile', function(req,res){                ///change this
  res.render("edit_snippet");                     //////Edit made
});

router.post('/editProfile', function(req,res){           ///change this


  res.redirect("edit_snippet");                 //////////Edit made
});

///////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////
// This is just a finder Boiler plate , this returns everything in your users collection:
router.get('/all_snippets', function(req,res) {
  console.log(req.user);
  User.find({})
    .then(function(users) {
      res.render("all_snippets", {users : users});
    })
    .catch(function(err){
      next(err);
    })
});

router.post("/edit_snippet", function (req,res) {
  req.user.update({                                  //////this is the session:
    // avatar:req.body.avatar,
    // university:req.body.university,
    // job:req.body.job,
    // company:req.body.company
  }).then(function(data){
    console.log(data);
    res.redirect("/all_snippets");
  })
  .catch(function(err){
    console.log(err);
    res.redirect("/update_snippet");
  })
});

router.get("/update_snippet",function (req,res) {
  res.render("edit_snippet", {users: req.user});
  console.log(req.body);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////













/////////////////////////////////////////////
