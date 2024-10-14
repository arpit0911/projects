const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

//  * use declaration
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// * Database connection
main()
  .then((res) => console.log("Connection successful with Database"))
  .catch((err) => console.error("Error connecting Database", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Database initialization successful");
};

initDB();

