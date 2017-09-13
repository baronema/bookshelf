var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Book        = require("./models/book"),
    User        = require("./models/user"),
    session     = require("express-session"),
    methodOverride = require("method-override");
    
// REQUIRING ROUTES
var bookRoutes       = require("./routes/book"),
    libraryRoutes    = require("./routes/library"),
    indexRoutes      = require("./routes/index");
    
// mongoose.connect("mongodb://localhost/bookshelf");

var url = process.env.DATABASEURL || "mongodb://primrose:kathyskids@ds127994.mlab.com:27994/bookshelfapp";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(flash());

//app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Never to early to start reading",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/library", libraryRoutes);
app.use("/book", bookRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Bookshelf Server Has Started!");
});