import { connectToDB } from "@/app/lib/db";
import Blog from "@/app/lib/models/blog";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId } = await params;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        await connectToDB();

        // Fetch blogs with pagination
        //@ts-expect-error
        const blogs = await Blog.find({ author: userId })
            .sort({ createdAt: -1 }) // Sort by latest blogs first
            .skip(skip)
            .limit(limit)
            .populate("author", "name email username");

        const totalBlogs = await Blog.countDocuments({ author: userId });

        return NextResponse.json({ 
            blogs, 
            hasMore: skip + blogs.length < totalBlogs // Check if there are more blogs to load
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}
