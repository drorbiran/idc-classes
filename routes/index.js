var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var Course      = require("../models/course");

//root rout
router.get("/", function(req, res){
    res.render("landing");
});

//=============================
// AUTH ROUTES
//=============================

//show the register form
router.get("/register", function(req,res){
    res.render("register",  {page: 'register'});
});

//handle register logic
router.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome to idc-courses");
            res.redirect("/courses");
        });
    });
});

//show login form
router.get("/login", function (req,res) {
    res.render("login",{page: 'login'});
});

//handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/courses",
        failureRedirect: "/login"
    }), function (req, res) {
});

//handle logout logic
router.get("/logout", function (req,res) {
    req.logout();
    req.flash("success", "You are logged out");
    res.redirect("/courses");
});

module.exports = router;