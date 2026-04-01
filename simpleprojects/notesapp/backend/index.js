const express=require("express");
const mongoose = require("mongoose");

const app=express();

app.use(express.json());

//wee have conected to the database and now we can perform CRUD operations on it

mongoose.connect("mongodb://127.0.0.1:27017/notesapp")
.then(()=>{
    console.log("connected to MongoDB");
}).catch((err)=>{
    console.log(err);
});

app.get("/",(req,res)=>{
    res.send("server is running");
});

app.listen(8080,()=>{
    console.log("server is working on port 8080");
});