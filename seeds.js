var mongoose    = require("mongoose");

var Course      = require("./models/course");
    Comment     = require("./models/comment");

var data = [
    {
        name: "Course1",
        image: "https://images.unsplash.com/photo-1502209877429-d7c6df9eb3f9?dpr=2&auto=format&fit=crop&w=1500&h=1005&q=80&cs=tinysrgb&crop=",
        description: "This is the description for this course This is the description for this course This is the description for this course This is the description for this course This is the description for this course"
    },
    {
        name: "Course2",
        image: "https://images.unsplash.com/photo-1484665739383-a1069a82d4be?dpr=2&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop=",
        description: "This is the description for this course This is the description for this course This is the description for this course This is the description for this course This is the description for this course"
    },
    {
        name: "Course3",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?dpr=2&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop=",
        description: "This is the description for this course This is the description for this course This is the description for this course This is the description for this course This is the description for this course"
    }
];

function seedDB(){
    //removing all courses
    Course.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed all courses");
        //adding new courses
            data.forEach(function(seed){
                Course.create(seed, function(err, course){
                    if(err){
                        console.log(err);
                    }
                    console.log("course was added");
                    //add a comment
                    Comment.create(
                        {
                            text: "this is a template comment",
                            author: "jhon"
                        }, function(err,comment){
                            if(err){
                                console.log(err);
                            } else {
                                course.comments.push(comment);
                                course.save();
                                console.log("comment added");
                            }
                        }
                    )
                })
            })
    });
}

module.exports = seedDB;


