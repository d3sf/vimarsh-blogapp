"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

const SettingsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A1B1E] transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-[#1E1F21] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <Settings className="text-customPink" size={48} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Settings page is coming soon! We're working on bringing you a better experience.
            </p>
            <div className="mt-4 px-4 py-2 bg-customPink/10 text-customPink rounded-full text-sm font-medium">
              Stay tuned for updates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 