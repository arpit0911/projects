// * imports/requires
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  console.log("env", process.env.NODE_ENV);
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//  * use declaration
const app = express();
const port = 8080;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
console.log("dbUrl", dbUrl);
// * database connections

main()
  .then((res) => console.log("Connection successful with Database"))
  .catch((err) => console.error("Error connecting Database", err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs"); // to specify the view engine
app.set("views", path.join(__dirname, "views")); // to link the views
app.use(express.urlencoded({ extended: true })); // use the urlencoded middleware function from express to read the data from url
app.use(methodOverride("_method")); // html form only have post and get methods methodOverride used for put, delete etc methods
app.engine("ejs", ejsMate); // setup ejsMate templates
app.use(express.static(path.join(__dirname, "/public"))); //use the static middleware function from express to serve the static files from backend

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "myeupersecretcode",
  },
  touchAfter: 24 * 60 * 60, // time period in seconds
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const sessionOptions = {
  //session option use in creating anu session with these details
  store: store, // store the session in the mongoDB
  secret: "myeupersecretcode", //secret key for the session
  resave: false,
  saveUninitialized: true,
  cookie: {
    // cookie to identify the session
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// * root Routes
// app.get("/", (req, res) => {
//   res.send("Iam Home Route");
// });

app.use(session(sessionOptions)); // session options provide is used to create the session with
app.use(flash()); // flash is used to show ths flash message on success or error of any processes

app.use(passport.initialize()); //initialize the passport
app.use(passport.session()); //passport uses the session
passport.use(new LocalStrategy(User.authenticate())); // provide the authenticate method to user

passport.serializeUser(User.serializeUser()); // this helps save the loggedIn user data in the browser
passport.deserializeUser(User.deserializeUser()); // this helps remove the loggedIn user data from the browser

app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // req object cant be directly used in the ejs template i.e we use local variables
  res.locals.error = req.flash("error"); // same as above
  res.locals.curUser = req.user; // req.user cant be directly use in the ejs template so we define userdetails variable which will be used in the ejs template to menupulate the ui
  next();
});

// app.get("/demouser", async (req, res) => {
//   const fakeUser = {
//     email: "student@gmail.com",
//     username: "delta-student",
//   };

//   let registeredUser = await User.register(fakeUser, "password");
//   res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

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
