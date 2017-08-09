var express         = require("express"),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local");



//models
var Course      = require("./models/course"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds.js");

seedDB();

//mongoose config
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/idc", {
    useMongoClient: true
}).then(function () {
    console.log('MongoDB has been connected');
}).catch(function (err) {
    console.log('Error while trying to connect with MongoDB');
    console.log(err);
});

//general config
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//passport config
app.use(require("express-session")({
    secret: "Hakol beseder todo bom",
    resave: false,
    saveUninitialized  : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
   res.render("landing");
});

//=============================
// COURSE ROUTES
//=============================
//INDEX - display all courses
app.get("/courses", function(req,res){
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
app.post("/courses", function(req,res){
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
app.get("/courses/new", function(req,res){
    res.render("courses/new.ejs");
});

//SHOW - show course page
app.get("/courses/:id", function(req,res){
    //get the course from the db
    Course.findById(req.params.id).populate("comments").exec(function(err,foundCourse){
       if (err){
           console.log(err);
       } else {
           console.log(foundCourse);
           res.render("courses/show",{course: foundCourse});
       }
    });
});

//=============================
// COMMENTS ROUTES
//=============================
//NEW - show a from to create a comment
app.get("/courses/:id/comments/new",function(req, res){
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
app.post("/courses/:id/comments", function(req,res){
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
                    console.log(comment);
                    course.save();
                    //redirect to the course page
                    res.redirect("/courses/" + course._id);
                };
            })
        }
    });
});

//=============================
// AUTH ROUTES
//=============================

//show the register form
app.get("/register", function(req,res){
    res.render("register");
});

//handle register logic
app.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/courses");
        });
    });
});

//show login form
app.get("/login", function (req,res) {
    res.render("login");
});

//handle login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/courses",
        failureRedirect: "/login"
    }), function (req, res) {
});

app.listen(3000,function(){
    console.log("idc-courses server is listening on port 3000");
});