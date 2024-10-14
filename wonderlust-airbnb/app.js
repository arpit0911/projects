// * imports/requires
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const { render } = require("ejs");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// * Routes
app.get("/", (req, res) => {
  res.send("Working fine");
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Singh villa",
//     description: "Pradhan House",
//     price: 1200,
//     location: "Bahalolpur, Azamgarh",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample saves successful");
//   res.send("Successful");
// });

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

// * Express server connection
app.listen(port, () => {
  console.log(`Connection Successful follow link`, `http://localhost:${8080}`);
});
