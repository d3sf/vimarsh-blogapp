import { connectToDB } from "@/app/lib/db";
import User from "@/app/lib/models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Import NextAuth session (if using authentication)
import { authOptions } from "../../auth/[...nextauth]/route";


export async function PUT(req: Request) {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions); // Get the logged-in user

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, about } = await req.json(); // Parse request body

        if (!name || name.trim() === "") {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }
        //@ts-expect-error
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email }, // Find user by email from session
            { name, about }, // Update name & about
            { new: true, select: "-password" } // Return updated user excluding password
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
