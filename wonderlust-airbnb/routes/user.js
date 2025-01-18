const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// get route
router.get("/signup", userController.renderSignupForm);

// register route
router.post("/signup", wrapAsync(userController.signup));

// show login route
router.get("/login", userController.renderLoginForm);

// login route
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.login)
);

//  login out route
router.get("/logout", userController.logout);

module.exports = router;
