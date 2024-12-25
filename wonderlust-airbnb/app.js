// * imports/requires
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

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

const sessionOptions = {
  secret: "myeupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// * root Routes
app.get("/", (req, res) => {
  res.send("Iam Home Route");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
  // res.status(statusCode).send(message);
});

// * Express server connection
app.listen(port, () => {
  console.log(`Connection Successful follow link`, `http://localhost:${8080}`);
});
