//=============================
// COMMENTS ROUTES
//=============================
var express = require("express");
var router = express.Router({mergeParams: true});

//models
var Course = require("../models/course");
    Comment = require("../models/comment");


//NEW - show a from to create a comment
router.get("/new",isLoggedIn, function(req, res){
    //find course by id
    Course.findById(req.params.id, function(err,course){
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {course:course});
        }
    });
});

//CREATE - create a new comment
router.post("/",isLoggedIn, function(req,res){
    //find the course according to id
    Course.findById(req.params.id,function(err,course){
        if (err) {
            console.log(err);
            res.redirect("/courses");
        } else {
            //create the comment
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                } else {
                    //add the comment to the course
                    course.comments.push(comment);
                    course.save();
                    //redirect to the course page
                    res.redirect("/courses/" + course._id);
                };
            })
        }
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;