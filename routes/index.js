var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

// GET REQUESTS
//==============================================================================

//LOGIN - root route
router.get("/", function(req, res){
    res.render("login");
});

//REGISTER - show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//LOGIN - show login form
router.get("/login", function(req, res){
    res.render("login"); 
});

//LOGIN - logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "LOGGED YOU OUT!");
   res.redirect("/login");
});

// POST REQUESTS
//==============================================================================

//REGISTER - handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/library"); 
        });
    });
});

//LOGIN - handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/library",
        failureRedirect: "/login"
    }), function(req, res){
});

module.exports = router;