const Listing = require("./models/listing");
const Review = require("./models/review");
module.exports.isLoogedIn=(req,res,next)=>{
    
   if (!req.isAuthenticated()) {

    req.session.returnTo=req.originalUrl; // ✅ store the url they are requesting

    req.flash("error", "You must be logged in to create listing!");
    return res.redirect("/login"); // ✅ important return
  }
  next();
};


module.exports.SaveRedirectURL=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  // ✅ check if user exists
  if (!req.user) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  // ✅ check owner
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.isReviewOwner = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  // ❌ safety check missing tha
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  // ❌ req.user undefined ho sakta hai
  if (!req.user) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  // ✅ correct check
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the review owner, you cannot delete!");
    return res.redirect(`/listings/${id}`); // ✅ FIXED
  }

  next();
};