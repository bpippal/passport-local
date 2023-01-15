if (process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();

// Storing users at the server level
const users = [];

const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride  = require("method-override");
const initializePassport = require("./passport-config")

initializePassport(passport , 
    email => users.find(user => user.email === email) , 
    id => users.find(user => user.id === id)
)

//Middlewares
app.set("view-engine", "ejs");
app.use(express.urlencoded({extended : false}))
app.use(flash());
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"))

//Logger function to see req.session on every request
// app.use("*" , function(req, res , next){
//     console.log("Main middleware always called");
//     console.log(req.session);

//     return next();
// })

//Get methods to render respectivie page's
app.get("/" , (req ,res) => {
    res.render("index.ejs" , {name : "Bharat"});
})

app.get("/login" , (req, res) => {
    res.render("login.ejs");
})

app.get("/register" , (req, res) => {
    res.render("register.ejs");
})


//Post methods to initiate the login/register
app.post("/login" , passport.authenticate("local" , {
    failureRedirect : "/login",
    successRedirect : "/",
    failureFlash : true
}))

app.post("/register" , async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id : Date.now().toString(),
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword
        });

        console.log(users)

        return res.redirect("/login");
    
       } catch (error) {
        return res.redirect("/register");
       } 
})

app.listen(3000, function(){
    console.log("Server is live !!!!!");
})