import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) 
      throw new Error("Missing MONGODB_URI in .env");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Atlas connected");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};