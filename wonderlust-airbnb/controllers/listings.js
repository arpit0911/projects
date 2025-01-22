const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
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
};

module.exports.createListing = async (req, res) => {
  const { listing } = req.body;
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "...", filename);
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const foundListing = await Listing.findById(id);
  if (!foundListing) {
    req.flash("error", "Listing Not Found");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing: foundListing });
};

module.exports.updateListing = async (req, res) => {
  const { listing } = req.body;
  const { id } = req.params;
  // console.log(listing);
  await Listing.findByIdAndUpdate(id, listing);
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success", " Listing Deleted!");
  res.redirect("/listings");
};
