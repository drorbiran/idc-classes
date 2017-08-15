//all middlewares
//models
var Course      = require("../models/course");
    Comment     = require("../models/comment");

const middlewareObj = {};


middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

middlewareObj.isCommentAuthor = function(req,res,next){
    //check if login
    if(req.isAuthenticated()){
        //check if the user is the owner of comment
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
};


middlewareObj.isCourseAuthor = function(req,res,next){
    //check if login
    if(req.isAuthenticated()){
        //check if the user is the owner of course
        Course.findById(req.params.id, function(err, foundCourse){
            if(err){
                res.redirect("back");
            } else {
                if(foundCourse.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
};

module.exports = middlewareObj;