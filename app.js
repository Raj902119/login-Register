//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const mongooseEnc= require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//secret key for encryption and decryption

userSchema.plugin(mongooseEnc, {secret: process.env.secret, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/",(req,res)=>{
    res.render("home")
});

app.get("/login",(req,res)=>{
    res.render("login")
});

app.get("/register",(req,res)=>{
    res.render("register")
});

//from rigistrating page to secret page
app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(() => {
            res.render("secrets");
        })
        .catch((err) => {
            console.error(err);
            res.send("An error occurred while registering the user.");
        });
});

//this is for login 
app.post("/login", (req,res)=>{
    //will check if email and password is present in database
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(foundUser => {
            if (foundUser && foundUser.password === password) {
                res.render("secrets");
            } else {
                res.send("Invalid email or password.");
            }
        })
        .catch(err => {
            console.error(err);
            res.send("An error occurred while processing your request.");
        });
});


app.listen(3000,function(){
    console.log("server actve on port 3000")
});