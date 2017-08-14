//=============================
// COURSE ROUTES
//=============================
var express = require("express");
var router = express.Router();
var Course = require("../models/course");

//INDEX - display all courses
router.get("/", function(req,res){
    //get all courses from db
    Course.find({}, function(err,allCourses){
        if (err){
            console.log(err);
        } else {
            //render the courses page with all courses
            res.render("courses/index",{courses:allCourses});
        }
    })
});

//CREATE - add new course to db
router.post("/",isLoggedIn, function(req,res){
    //get course data from a form and add it to the db
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCourse = {name:name, image:image, description:description, author: author};
    Course.create(newCourse, function(err,newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect to the courses page
            res.redirect("/courses");
        }
    });
});

//NEW - show a from to create a course
router.get("/new",isLoggedIn, function(req,res){
    res.render("courses/new.ejs");
});

//SHOW - show course page
router.get("/:id", function(req,res){
    //get the course from the db
    Course.findById(req.params.id).populate("comments").exec(function(err,foundCourse){
        if (err){
            console.log(err);
        } else {
            res.render("courses/show",{course: foundCourse});
        }
    });
});

//Edit - show the edit course page
router.get("/:id/edit",isCourseAuthor, function (req,res) {
    Course.findById(req.params.id, function(err, foundCourse){
        if (err){
            res.redirect("/courses");
        } else {
            res.render("courses/edit", {course_id: req.params.id, course: foundCourse});
        }
    });
});

//UPDATE - updating the course
router.put("/:id",isCourseAuthor, function(req,res){
    Course.findByIdAndUpdate(req.params.id, req.body.course, function(err,updated){
        if (err){
            res.redirect("/courses");
        } else {
            res.redirect("/courses/" + req.params.id);
        }
    })
});

//DESTROY - deleting a course
router.delete("/:id",isCourseAuthor, function(req,res){
   Course.findByIdAndRemove(req.params.id, function(err){
       if (err){
           res.redirect("/courses");
       } else {
           res.redirect("/courses");
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

function isCourseAuthor(req,res,next){
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
}

module.exports = router;