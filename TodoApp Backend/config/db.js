const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: successful`); // conn.connection.host
  } catch (error) {
    console.error(`Failed to connect to MongoDB:`, error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;