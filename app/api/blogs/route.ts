import { connectToDB } from "@/app/lib/db";
import Blog from "@/app/lib/models/blog";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await connectToDB();

        // Extract query parameters page and limit from the request URL
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        // Calculate the number of documents to skip for pagination
        const skip = (page - 1) * limit;

        // Fetch the blogs from the database
        //@ts-expect-error
        const blogs = await Blog.find({},"title description author createdAt")
            .populate("author", "name email image username")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }) // Sorting blogs by newest first
            // .distinct('_id'); // Ensure unique documents

        // Get the total number of blogs for pagination purposes
        const totalBlogs = await Blog.countDocuments();

        // console.log("Fetched blogs:", blogs);  // Debugging log

        // Return the fetched blogs along with total count, page, and limit for pagination
        return NextResponse.json({ blogs, totalBlogs, page, limit }, { status: 200 });
    } catch (error) {
        console.error("Error fetching blogs:", error); // Debugging error
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}
