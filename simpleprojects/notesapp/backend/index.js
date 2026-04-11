
const express=require("express");


const mongoose = require("mongoose");


//importing the note model to perform CRUD operations on it
const Note = require("./models/note");

const app=express();

const cors = require("cors");
app.use(cors());


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



//create a new note
app.post("/add-note",async(req,res)=>{
      console.log("ADD API HIT 🔥");  
    const {title,desc} = req.body;

    try{
        console.log(title, desc);
        const note= new Note({title,desc});
        await note.save();
        res.json({message:"Note added successfully"});

    } catch (err) {
        res.status(500).json({message:"Error adding note"});
    }
   

});

//get all notes
app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.listen(8080,()=>{
    console.log("server is working on port 8080");
});