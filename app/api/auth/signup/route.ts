import { connectToDB } from "@/app/lib/db";
import { generateUsername } from "@/app/lib/generateUsername";
import User from "@/app/lib/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
// Import the function


export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        await connectToDB();

        // Check if email is already used
        // @ts-expect-error
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        // Generate a unique username
        const username = await generateUsername(email);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create and save user
        const newUser = new User({ name, email, password: hashedPassword, username });
        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
