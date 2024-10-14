// * imports/requires
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//  * use declaration
const app = express();
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// * database connections

main()
  .then((res) => console.log("Connection successful with Database"))
  .catch((err) => console.error("Error connecting Database", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs"); // to specify the view engine
app.set("views", path.join(__dirname, "views")); // to link the views
app.use(express.urlencoded({ extended: true })); // used so that we can read the data from params
app.use(methodOverride("_method")); // html form only have post and get methods methodOverride used for put, delete etc methods
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// * root Routes
app.get("/", (req, res) => {
  res.send("Iam Home Route");
});

// * index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// * New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// * show route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  let foundListing = await Listing.findById(id);
  // console.log("found listing", foundListing);
  res.render("listings/show.ejs", { listing: foundListing });
});

// * create route
app.post("/listings", async (req, res) => {
  const { listing } = req.body;
  // console.log(listing);
  const newListing = new Listing(listing);
  await newListing.save();
  res.redirect("/listings");
});

// * show edit route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const foundListing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing: foundListing });
});

// * Update route
app.put("/listings/:id", async (req, res) => {
  const { listing } = req.body;
  const { id } = req.params;
  // console.log(listing);
  await Listing.findByIdAndUpdate(id, listing);
  res.redirect(`/listings/${id}`);
});

// * delete route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  res.redirect("/listings");
});

// * Express server connection
app.listen(port, () => {
  console.log(`Connection Successful follow link`, `http://localhost:${8080}`);
});
