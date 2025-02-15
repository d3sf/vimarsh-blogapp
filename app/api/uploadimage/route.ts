import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      // ✅ Handling Google Profile Image (URL)
      const { image } = await req.json();
      if (!image) {
        return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
      }

      // Download the image and upload to Cloudinary
      const response = await axios.get(image, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data);
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "blogs/profile_pictures", resource_type: "auto" },
          (error, result) => (error ? reject(error) : resolve(result))
        ).end(buffer);
      });

      return NextResponse.json({ url: (uploadResponse as any).secure_url });
    }

    // ✅ Handling File Upload from User
    const formData = await req.formData();
    const file = formData.get("image") as Blob;
    const folder = formData.get("folder") as string || "blogs/profile_pictures";

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert Blob to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64Image}`;

    // Upload to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(dataUri, { folder });

    return NextResponse.json({ url: uploadedImage.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
