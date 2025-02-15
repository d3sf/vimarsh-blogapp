import { connectToDB } from "@/app/lib/db";
import Blog from "@/app/lib/models/blog";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/app/lib/models/user";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Helper function to extract public IDs from Cloudinary URLs
const extractPublicId = (url: string) => {
  try {
    // Handle both secure and non-secure URLs
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // Find the index of 'upload' in the path
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1 || uploadIndex === pathParts.length - 1) return null;
    
    // Get all parts after 'upload' and before any transformations
    const partsAfterUpload = pathParts.slice(uploadIndex + 1);
    // Remove version prefix if present (e.g., 'v1234567890')
    const partsWithoutVersion = partsAfterUpload[0].startsWith('v') 
      ? partsAfterUpload.slice(1) 
      : partsAfterUpload;
    
    // Join the remaining parts to get the full public ID
    const publicId = partsWithoutVersion.join('/');
    // Remove file extension if present
    return publicId.replace(/\.[^/.]+$/, '');
  } catch (error) {
    console.error('Error extracting public ID from URL:', url, error);
    return null;
  }
};

// Helper function to extract image URLs from TipTap content
const extractImageUrls = (content: any): string[] => {
  const urls: string[] = [];
  
  if (!content) return urls;
  
  const traverse = (node: any) => {
    if (node.type === 'image' && node.attrs?.src) {
      urls.push(node.attrs.src);
    }
    if (node.content) {
      node.content.forEach(traverse);
    }
  };
  
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      if (parsed.content) {
        parsed.content.forEach(traverse);
      }
    } catch (e) {
      console.error('Error parsing content JSON:', e);
      return urls;
    }
  } else if (content.content) {
    content.content.forEach(traverse);
  }
  
  return urls;
};

// Using async for the params extraction directly in the handler, no need to "await" params explicitly

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;  // Accessing params directly, no need to await.

        await connectToDB();
        //@ts-expect-error
        const blog = await Blog.findById(id).populate("author", "name email image username") ;

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }
        return NextResponse.json({ blog }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
    }
}

// Similarly for DELETE and PUT operations
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();

        // Find the blog
        //@ts-expect-error
        const blog = await Blog.findById(id);
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        // Get the logged-in user
        //@ts-expect-error
        const user = await User.findOne({ email: session.user.email });

        // Check if the logged-in user is the author
        if (!user || blog.author.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        // Extract image URLs from the blog content
        const imageUrls = extractImageUrls(blog.content);
        console.log('Found image URLs:', imageUrls);

        // Delete images from Cloudinary
        for (const url of imageUrls) {
            const publicId = extractPublicId(url);
            console.log('Extracted public ID:', publicId, 'from URL:', url);
            
            if (publicId) {
                try {
                    const result = await cloudinary.uploader.destroy(publicId);
                    console.log('Cloudinary deletion result:', result);
                } catch (error) {
                    console.error(`Failed to delete image ${publicId}:`, error);
                }
            } else {
                console.warn('Could not extract public ID from URL:', url);
            }
        }

        // Delete the blog
        //@ts-expect-error
        await Blog.findByIdAndDelete(id);

        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params; // Directly access id from params

        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();

        // Find the blog
        //@ts-expect-error
        const blog = await Blog.findById(id);

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        // Get the logged-in user
        //@ts-expect-error
        const user = await User.findOne({ email: session.user.email });

        // Check if the logged-in user is the author
        if (!user || blog.author.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        // Update the blog
        const { title, description, content } = await req.json();

        // update the blog fields
        blog.title = title || blog.title;
        blog.description = description || blog.description;  // Added description update
        blog.content = content || blog.content;

        await blog.save();

        return NextResponse.json({ message: "Blog updated successfully", blog }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
    }
}
