const mongoose = require("mongoose");

const database_connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {});
    console.log("MongoDB database connected.");
  } catch (err) {
    console.error("Error connecting to MongoDB database.", err);
    process.exit(1);
  }
};

module.exports = database_connection;
