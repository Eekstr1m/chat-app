import mongoose from "mongoose";

export default async function connectToMongo() {
  try {
    const MONGO_URL = process.env.MONGO_URL;
    if (!MONGO_URL) {
      console.log("MONGODB_URL is missing, please fill the value!");
      process.exit(1);
    }
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
}
