import { v2 as cloudinary } from "cloudinary";

import { NextRequest, NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


export async function POST(req: NextRequest) {
  try {
    // Extract image data from the request body
    const { imageData } = await req.json();
    
    
    if (!imageData) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    // Upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageData, {
      folder: "blogs", // Optional: Organize images in a folder
      resource_type: "auto", // Automatically detect resource type (image, video, etc.)
    });

    // Return the image URL in the response
    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    // Handle errors
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
