export const imageUpload = async (folder: string, file?: File, imageUrl?: string, ) => {
  if (!folder) {
    console.error("Error: Folder name is required!");
    return null;
  }

  const formData = new FormData();
  if (file) formData.append("image", file);
  if (imageUrl) formData.append("imageUrl", imageUrl);
  formData.append("folder", folder);

  try {
    const response = await fetch("/api/uploadimage", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Upload failed");

    console.log("Image uploaded successfully:", data.url);
    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
