const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Snippet= require('../models/snippet');

const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');


mongoose.connect("mongodb://localhost:27017/creating_a_snippet");

const requireLogin = function(req, res, next) {
  if (req.user){
    console.log(req.user);
    next();
  } else {
    redirect('/')
  }
}

const login = function(req, res, next) {
  if (req.user) {
    res.redirect('home_page');
  } else {
    next();
  }
}


///////////////////////////////////
router.get("/", function (req,res) {
  res.render("login");
});

router.post("/", passport.authenticate('local', {
    successRedirect:'/home_page',
    failureRedirect: '/',
    failureFlash: true
}));

//////////////////////////////////////////////////////

router.get("/sign_up", function (req,res) {
  res.render("sign_up");
});
///////////////////////////////////
router.post("/sign_up", function(req,res){
  User.create({
    username:req.body.username,
    password:req.body.password,
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
router.get("/home_page", requireLogin, function (req,res) {
  Snippet.find({ username: req.user.username})
    .then(function(snippets){
    res.render("home_page", {user: req.user.id, username:req.body.username, snippets:snippets });
    })

});
///////////////////////////////////////////////////////////
router.post("/home_page", requireLogin, function (req,res){
  let tags= req.body.tags.split(",");
  Snippet.create({
    username:req.user.username,
    title:req.body.title,
    body:req.body.body,
    optionalNotes:req.body.optionalNotes,
    language: req.body.language,
    tags:tags
  }).then(function(data){
    console.log(data);
    res.redirect("/home_page");
  })
  .catch(function(err){
    console.log(err);
    res.redirect("/home_page");
  })
});
////////////////////////////////
router.get("/tags/:tags", function (req,res){
  Snippet.find({})
    .then(function(data){
      let snip = [];
      data.forEach(function(datas){
        datas.tags.forEach(function(tag){
          if (tag === req.params.tag) {
            snip.push(datas);
            return;
          }
        })
      })
      res.render("tags", { snippets:data, username:req.user.username }  )
    })
});
///////////////////////////////////////
router.get("/language/:language", function (req,res){
  Snippet.find({
    language: req.params.language
  })
    .then(function(snippets){
      res.render("language", { snippets:snippets, username:req.user.username }  )
    })
});




///////////////////////////////////////
router.post("/edit_snippet", function (req,res) {
  Snippet.update({                                  //////this is the session:
    username:req.user.username,
    title:req.body.title,
    body:req.body.body,
    optionalNotes:req.body.optionalNotes,
    language: req.body.language,
    tags:req.body.tags
  }
 , {id:req.params.id})

  .then(function(data){
      Snippet.findOne({id:req.params.Snippet})
      .then(function(snippet) {
        res.redirect("/home_page")
      })
  })

  .catch(function(err){
    console.log(err);
    res.redirect("/edit_snippet");
  })
})

router.get("/edit_snippet",function (req,res) {
  res.render("edit_snippet", {users: req.user});
  console.log(req.body);
});

////////////////////////////////////////////
router.post("/destroy/:id", function (req,res) {
  Snippet.deleteOne({
    id: req.params.snippetId
  })
  .then(function(data){
    res.redirect("/home_page");
  });
});
/////////////////////////////////
  router.get("/logout", function(req,res){
  req.logout();
  res.redirect("/")
})
///////////////////////////////////
router.get("/individual_snippet/:id", function(req,res){
  Snippet.findById(req.params.id)
      .then(function(snippet){
        res.render("individual_snippet", {snippets:snippet})
      })
})


////////////////////////////////////////////










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
///////////////////////////////////////////////////










module.exports = router;


/////////////////////////////////////////////
