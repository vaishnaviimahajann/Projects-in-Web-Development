const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ✅ FLASH GLOBAL (IMPORTANT)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

app.get("/", (req, res) => {
  res.send("Hi I am root");
});

// INDEX
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// NEW
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// CREATE
app.post("/listings", wrapAsync(async (req, res) => {

  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }

  const newListing = new Listing(req.body.listings);
  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
}));

// 🔥 SHOW (FIXED)
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");

  // ✅ HANDLE DELETED / INVALID ID
  if (!listing) {
    req.flash("success", "Listing you are looking for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
}));

// EDIT
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("success", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
}));

// UPDATE
app.put("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listings });

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

// DELETE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}));

// REVIEW ADD
app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
}));

// REVIEW DELETE
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
}));

// 404
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// ERROR
app.use((err, req, res, next) => {
  let { statusCode = 500 } = err;
  res.status(statusCode).render("error.ejs", { err });
});