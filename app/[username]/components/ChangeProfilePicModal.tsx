"use client";

import { useState } from "react";
import axios from "axios";

import { ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const ChangeProfilePicModal = ({ user, setUser, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession(); // Get session & update function

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "blogs/profile_pictures");

    try {
      const { data } = await axios.post("/api/uploadimage", formData);
      await axios.put("/api/user/updateimage", { image: data.url });

      setUser((prev) => ({ ...prev, image: data.url }));
      await update(); //  Refresh session so navbar updates
        window.location.reload(); //  Force full reload
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };
  const handleRemove = async () => {
    setLoading(true);
    try {
      await axios.put("/api/user/updateimage", { image: null });
  
      setUser((prev) => ({ ...prev, image: null }));
      await update(); // 🔥 Refresh session after removal
      window.location.reload(); // 🔥 Force full reload
    } catch (error) {
      console.error("Failed to remove image", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-[#1E1F21] p-6 rounded-lg shadow-lg w-96 border border-gray-200 dark:border-gray-700">
        <p className="text-md text-gray-900 text-center dark:text-gray-100 mb-4 font-thin">Change Profile Picture</p>
        
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-32 h-32">
            <Image
              src={user?.image || "/images/defaultAvatar.png"}
              alt={user?.name || "User avatar"}
              width={128}
              height={128}
              className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <label className="w-full">
              <input type="file" className="hidden" onChange={handleUpload} />
              <div className="bg-customPink text-white py-2 px-4 rounded-md cursor-pointer hover:bg-pink-700 transition-colors duration-200 text-center">
                {loading ? "Uploading..." : "Upload Image"}
              </div>
            </label>

            {user.image && (
              <button
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                onClick={handleRemove}
                disabled={loading}
              >
                {loading ? "Removing..." : "Remove Image"}
              </button>
            )}

            <button
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePicModal;
