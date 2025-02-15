"use client";

import { useState } from "react";
import Image from "next/image";
import ChangeProfilePicModal from "./ChangeProfilePicModal";
import EditProfileModal from "./EditProfileModal";
import { Calendar } from "lucide-react";
import { formattedMonthYear } from "@/app/components/utility/formattedTime";
import { useSession } from "next-auth/react";

const ProfileHeader = ({ user, setUser }) => {
  const { data: session } = useSession();
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const date = formattedMonthYear(user.createdAt);
  const isOwner = session?.user?.email === user.email;

  return (
    <div>
      <div className="flex justify-between py-8 px-6">
        <div className="flex gap-8">
          <div
            className="relative w-32 h-32 group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Image
              src={user?.image || "/images/defaultAvatar.png"}
              alt={user?.name || "User avatar"}
              width={128}
              height={128}
              className="relative w-full h-full rounded-full border-4 border-white dark:border-gray-800 object-cover transition-all duration-300 "
              priority
            />
            {isOwner && isHovering && (
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
                onClick={() => setIsProfilePicModalOpen(true)}
              >
                <span className="text-white text-sm font-medium">Edit</span>
              </div>
            )}
          </div>

          <div className="mt-12">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-50 transition-colors duration-200">{user.name}</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs border border-gray-200 dark:border-gray-700 rounded-full mt-3 inline-flex items-center px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 transition-all duration-200">
              <Calendar size={14} className="mr-1.5" />
              <span>Joined {date}</span>
            </div>
          </div>
        </div>

        {isOwner && (
          <div>
            <button
              className="text-green-500 hover:text-black dark:text-green-400 dark:hover:text-white px-4 py-2 rounded-lg text-sm font-medium mt-20 transition-all duration-200 "
              onClick={() => setIsEditProfileModalOpen(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {isProfilePicModalOpen && (
        <ChangeProfilePicModal
          user={user}
          setUser={setUser}
          onClose={() => setIsProfilePicModalOpen(false)}
        />
      )}

      {isEditProfileModalOpen && (
        <EditProfileModal
          user={user}
          setUser={setUser}
          onClose={() => setIsEditProfileModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
