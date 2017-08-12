var mongoose    = require("mongoose");

var Course      = require("./models/course");
    Comment     = require("./models/comment");

var data = [
    {
        name: "Course1",
        image: "https://www.idc.ac.il/he/schools/cs/PublishingImages/Untitled%20design%20(6).jpg",
        description: "This is the description for this course This is the description for this course This is the description for this course This is the description for this course This is the description for this course"
    },
    {
        name: "Course2",
        image: "https://www.idc.ac.il/he/schools/cs/PublishingImages/studio_3.jpg",
        description: "This is the description for this course This is the description for this course This is the description for this course This is the description for this course This is the description for this course"
    },
    {
        name: "Course3",
        image: "https://www.idc.ac.il/he/schools/cs/PublishingImages/studio_5.jpg",
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


