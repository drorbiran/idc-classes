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
                    //add user to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log("comment : " + comment);
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


//EDIT - show edit comment page
router.get("/:comment_id/edit",isCommentAuthor, function(req,res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
       if (err) {
           res.redirect("back");
       } else {
           res.render("comments/edit", {course_id: req.params.id, comment: foundComment});
       }
   })
});

//UPDATE - update the comment
router.put("/:comment_id",isCommentAuthor, function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
       if (err) {
           console.log("1");
           res.redirect("back");
       } else {
           console.log("2");
           res.redirect("/courses/" + req.params.id);
       }
   })
});

//DELETE - delete a comment
router.delete("/:comment_id",isCommentAuthor, function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/courses/" + req.params.id);
       }
   })
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

function isCommentAuthor(req,res,next){
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
}

module.exports = router;