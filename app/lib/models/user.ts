import {  Schema, model, models } from "mongoose";

// Define the interface for the User document
interface IUser  {
  name: string;
  username: string;
  email: string;
  password?: string;
  image?: string;
  about?: string;
  createdAt?: Date; // Optional: Include timestamps in the interface
  updatedAt?: Date;
}

// Define the schema with explicit typing
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    image: { type: String },
    about: { type: String },
    username: { type: String, unique: true, sparse: true } // Optional spares prevent mongo to enforce uniqueness on null values
  },
  { timestamps: true }
);

// Create or reuse the model
const User = models.User || model<IUser>("User", UserSchema);

export default User;