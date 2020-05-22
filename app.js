//jshint esversion:6
require("dotenv").config();
const bodyParser=require("body-parser");
const express=require("express");
const app=express();
const https=require("https");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption")
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// console.log( process.env.API_KEY);


mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useUnifiedTopology: true,useNewUrlParser:true,useFindAndModify: false}).then(()=>{
  console.log('connected to mongodb server');
}).catch((error)=>{
  console.log('error connecting to mongodb server',error);
});
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
// const secret="thisisourlittlesecret";
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})

const User=new mongoose.model("user",userSchema)
app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    const user=new User({
        email:req.body.username,
        password:req.body.password
    });
    user.save(function(err){
        if (err){
            console.log(err);
            
        }
        else{
            res.render("secrets")
        }
    })
})
app.post("/login",function(req,res){
    User.findOne({email:req.body.username},function(err,user){
        if (err){
            console.log(err);
            
        }
        else{
            if (user){
                if (user.password===req.body.password){
                    res.render("secrets");
                }
            }
        }
    })
})
app.listen(3000,function(){
    console.log("server started at port 3000")
})