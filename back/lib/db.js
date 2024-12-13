import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 60000, // Set timeout to 30 seconds (30000 milliseconds)
    });

    // Uncomment the line below to drop the database if needed
    // await mongoose.connection.dropDatabase();

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to database", error.message);
    process.exit(1); // Exit process with failure
  }
};
