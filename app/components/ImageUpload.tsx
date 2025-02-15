"use client";

import { useState } from "react";
import axios from "axios";

const ImageUpload = ({ onImageUpload }: { onImageUpload: (url: string) => void }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
    // api endpoint 
      const response = await axios.post("", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.secure_url;
      onImageUpload(imageUrl);  // Pass the image URL to the parent component
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default ImageUpload;
