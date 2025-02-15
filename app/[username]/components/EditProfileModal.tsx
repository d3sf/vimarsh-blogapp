"use client"

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";

const EditProfileModal = ({ user, setUser, onClose }) => {
  const [name, setName] = useState(user?.name || "");
  const [about, setAbout] = useState(user?.about || "");
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { data: session, update } = useSession();

  const handleImageUpload = async (event) => {
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
      await update();
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    setLoading(true);
    try {
      await axios.put("/api/user/updateimage", { image: null });
      setUser((prev) => ({ ...prev, image: null }));
      await update();
      toast.success("Profile picture removed successfully");
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Failed to remove image", error);
      toast.error("Failed to remove profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/user/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, about }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      const updatedUser = await res.json();
      
      setUser((prevUser) => ({ ...prevUser, name: updatedUser.name, about: updatedUser.about }));
      toast.success("Profile updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-[#1E1F21] p-6 rounded-lg shadow-lg w-96 border border-gray-200 dark:border-gray-700">
          <p className="text-md text-gray-900 dark:text-gray-100 mb-4 font-thin">Profile Information</p>
          
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-32 h-32 group">
              <Image
                src={user?.image || "/images/defaultAvatar.png"}
                alt={user?.name || "User avatar"}
                width={128}
                height={128}
                className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 object-cover"
                priority
              />
              <label className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <input type="file" className="hidden" onChange={handleImageUpload} />
                <span className="text-white text-sm font-medium">Change</span>
              </label>
            </div>

            {user.image && (
              <button
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors duration-200"
                onClick={() => setShowConfirmDialog(true)}
                disabled={loading}
              >
                Remove Profile Picture
              </button>
            )}

            <div className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-[#2A2B2D] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">About</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md min-h-32 resize-none whitespace-pre-line bg-white dark:bg-[#2A2B2D] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Tell us about yourself"
                />
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-customPink text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors duration-200 disabled:opacity-50"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
          <div className="bg-white dark:bg-[#1E1F21] p-6 rounded-lg shadow-lg w-80 border border-gray-200 dark:border-gray-700">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Remove Profile Picture</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to remove your profile picture? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                onClick={handleRemoveImage}
                disabled={loading}
              >
                {loading ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileModal;
