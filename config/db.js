const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected!");
  } catch (err) {
    console.error("DB Connection Failed: " + err.message);
  }
};

module.exports = connectDB;
