"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfileHeader from "./components/ProfileHeader";
import AboutSection from "./components/AboutSection";
import UserBlogs from "./components/userBlogs";

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [isBlogsReady, setIsBlogsReady] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const res = await fetch(`${baseUrl}/api/user/${username}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (username) fetchUser();
  }, [username]);
  // console.log(user)
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        {/* <h2 className="text-xl font-semibold">User not Found</h2> */}
      </div>
    );
  }

  return (
    <div className="w-full  min-h-screen bg-gray-50 dark:bg-[#1A1B1E] transition-colors duration-300">
      {/* Full-width Profile Header */}
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white dark:bg-[#1E1F21] rounded-2xl shadow-lg dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/30">
          <ProfileHeader user={user} setUser={setUser} />
        </div>
      </div>

      {/* Main Content: About Section + Blogs */}
      <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About Section (1/3 width on larger screens) */}
        <div className="md:col-span-1">
          {<AboutSection about={user.about} />}
        </div>

        {/* Blogs Section (2/3 width on larger screens) */}
        <div className="md:col-span-2">
          {isBlogsReady ? (
            <div className="bg-white dark:bg-[#1E1F21] rounded-2xl shadow-lg dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/30">
              <UserBlogs onReady={() => setIsBlogsReady(true)} />
            </div>
          ) : (
            <UserBlogs onReady={() => setIsBlogsReady(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
