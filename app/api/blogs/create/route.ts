import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/db";
import Blog from "@/app/lib/models/blog";
import User from "@/app/lib/models/user";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description , content } = await req.json();

        if (!title || !description || !content) {
            return NextResponse.json({ error: "Title,Description and  Content are required" }, { status: 400 });
        }

        await connectToDB();
        //@ts-expect-error
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const newBlog = new Blog({
            title,
            description,
            content, // Ensure TipTap content is correctly stored
            author: user._id,
        });

        await newBlog.save();

        return NextResponse.json({ 
            message: "Blog created successfully", 
            blog: newBlog 
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating blog:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
