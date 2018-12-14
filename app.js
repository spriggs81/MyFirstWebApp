var bodyParser       = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    flash            = require("connect-flash"),
    User             = require("./models/user"),
    seedDB           = require("./seeds"),
    app              = express();

//requiring routes
var clientRoutes    = require("./routes/clients"),
    productRoutes   = require("./routes/products"),
    serverRoutes    = require("./routes/servers"),
    adminRoutes     = require("./routes/admin"),
    adminDbRoutes   = require("./routes/admin_db"),
    adminUserRoutes = require("./routes/admin_user"),
    indexRoutes     = require("./routes/index"),
    knowledgeRoutes = require("./routes/knowledge");

// APP CONFIG    
//mongoose.connect("mongodb://localhost/support_tools_v4",
mongoose.connect("mongodb://spriggsdata:v1zexplorer@ds151242.mlab.com:51242/support_tool", (err) => {
    if(!err){
        console.log("MongoDB Connection Successful!");
    } else {
        console.log("Error in DB Connection : " + JSON.stringify(err, undefined, 2)); 
    }
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();


//Passport config
app.use(require("express-session")({
    secret: "Support Is Online",
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//using routes
app.use("/", indexRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/users", adminUserRoutes);
app.use("/admin/db", adminDbRoutes);
app.use("/clients", clientRoutes);
app.use("/clients/:id/products", productRoutes);
app.use("/clients/:id/servers", serverRoutes);
app.use("/knowledge", knowledgeRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Support Tool Is Online!");
});