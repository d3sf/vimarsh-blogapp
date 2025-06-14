import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

if (!(global as any).mongoose) {
  (global as any).mongoose = { conn: null, promise: null };
}
const cached = (global as any).mongoose;

export const connectToDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "blogDB", 
      bufferCommands: true,
    });
  }

  try {
    cached.conn = await cached.promise;
    (global as any).mongoose = cached; // Ensure global cache is set
    console.log("✅ Connected to MongoDB");
    return cached.conn;
  } catch (error) {
    // console.error("❌ Error connecting to MongoDB:", error);
    throw error;
  }
};
