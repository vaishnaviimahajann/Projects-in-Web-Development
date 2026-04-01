const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

const { SaveRedirectURL } = require("../middleware.js"); // ✅ correct import


// ================= SIGNUP =================
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        req.flash("error", "Login failed after signup");
        return res.redirect("/login");
      }

      req.flash("success", "Welcome to AIR-BNB!");
      return res.redirect("/listings");
    });

  } catch (e) {
    if (e.name === "UserExistsError") {
      req.flash("error", "User already registered. Please login.");
    } else {
      req.flash("error", e.message);
    }
    return res.redirect("/signup");
  }
}));


// ================= LOGIN =================
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  SaveRedirectURL, // ✅ middleware
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back! You are logged in.");

    // ✅ redirect to original page or listings
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);


// ================= LOGOUT =================
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;