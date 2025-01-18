const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index)) // * index route
  // * create route
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
  );

// * New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // * show route
  // * Update route
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  // * delete route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// * show edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
