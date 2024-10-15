// * imports/requires
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

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
app.use(express.urlencoded({ extended: true })); // use the urlencoded middleware function from express to read the data from url
app.use(methodOverride("_method")); // html form only have post and get methods methodOverride used for put, delete etc methods
app.engine("ejs", ejsMate); // setup ejsMate templates
app.use(express.static(path.join(__dirname, "/public"))); //use the static middleware function from express to serve the static files from backend

// * root Routes
app.get("/", (req, res) => {
  res.send("Iam Home Route");
});

// * index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// * New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// * show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let foundListing = await Listing.findById(id);
    // console.log("found listing", foundListing);
    res.render("listings/show.ejs", { listing: foundListing });
  })
);

// * create route
app.post(
  "/listings",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid Data");
    }
    const { listing } = req.body;
    // console.log(listing);
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// * show edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing: foundListing });
  })
);

// * Update route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid Data");
    }
    const { listing } = req.body;
    const { id } = req.params;
    // console.log(listing);
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`);
  })
);

// * delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
  res.send("something went wrong");
});

// * Express server connection
app.listen(port, () => {
  console.log(`Connection Successful follow link`, `http://localhost:${8080}`);
});
