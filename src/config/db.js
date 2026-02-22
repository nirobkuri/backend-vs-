const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI not set - skipping database connection.");
    return;
  }

  try {
    // New Mongoose v7+ no need for useNewUrlParser/useUnifiedTopology
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = connectDB;
