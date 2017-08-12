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
router.post("/", function(req,res){
    //get course data from a form and add it to the db
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCourse = {name:name, image:image, description:description};
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
router.get("/new", function(req,res){
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

module.exports = router;