const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// * index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// * New route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// * show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let foundListing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    // console.log("found listing", foundListing);
    if (!foundListing) {
      req.flash("error", "Listing Not Found!");
      res.redirect("/listings");
    }
    // console.log("Populated listing:", JSON.stringify(foundListing, null, 2));
    res.render("listings/show.ejs", { listing: foundListing });
  })
);

// * create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const { listing } = req.body;
    // console.log(listing);
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// * show edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing.findById(id);
    if (!foundListing) {
      req.flash("error", "Listing Not Found");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing: foundListing });
  })
);

// * Update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const { listing } = req.body;
    const { id } = req.params;
    // console.log(listing);
    await Listing.findByIdAndUpdate(id, listing);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// * delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
  })
);
module.exports = router;
