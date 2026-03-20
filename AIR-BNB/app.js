const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const{listingSchema}=require("./schema.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
});

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi I am root");
});


// INDEX ROUTE
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
}));


// NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});

/*
// CREATE ROUTE
app.post("/listings",
  wrapAsync(async (req,res,next)=>{
   let result=listingSchema.validate(req.body);

   console.log(result);
    
   const newListing=new Listing(req.body.listings);
   await newListing.save();
   res.redirect("/listings");
})
);*/
app.post("/listings", wrapAsync(async (req,res)=>{

  

  let { error } = listingSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }

  const newListing = new Listing(req.body.listings);
  await newListing.save();

  res.redirect("/listings");
}));



// SHOW ROUTE
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show",{listing});
}));


// EDIT ROUTE
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
}));


// UPDATE ROUTE
app.put("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listings});
    res.redirect(`/listings/${id}`);
}));


// DELETE ROUTE
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));
/*

app.all("/*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    
    let{statuscode,message}=err;
    res.status(statuscode).send(message);
});
*/
// 404 handler
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

// error handler
app.use((err,req,res,next)=>{
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs",{ err });
});