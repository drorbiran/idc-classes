var express         = require("express"),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override");

//models
var Course      = require("./models/course"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds.js");

//routes
var courseRoutes    = require("./routes/courses"),
    commentRoutes   = require("./routes/comments"),
    indexRoutes     = require("./routes/index");

// seedDB(); //seed the data base

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
app.use(methodOverride("_method"));
app.use(flash());


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

//sending data to all routes
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//using the routes
app.use(indexRoutes);
app.use("/courses",courseRoutes);
app.use("/courses/:id/comments",commentRoutes);

app.listen(3000,function(){
    console.log("idc-courses server is listening on port 3000");
});