"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import WriteBtn from "./ui/WriteBtn";
import ThemeToggle from "./ui/ThemeToggle";
import { User, LogOut, Settings } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const { data: session, status, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(session?.user?.image);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showWriteBtn = pathname === "/write" || pathname === "/edit/[id]";

  // Update profile picture only when user updates their profile
  useEffect(() => {
    const checkProfileUpdate = async () => {
      if (!session?.user) return;
      try {
        const res = await axios.get("/api/user/me");
        if (res.data?.image && res.data.image !== profilePic) {
          setProfilePic(res.data.image);
          update();
        }
      } catch (error) {
        console.error("Error fetching updated user data:", error);
      }
    };
    checkProfileUpdate();
  }, [session, update, profilePic]);

  const handleProfileClick = async () => {
    try {
      const response = await axios.get("/api/user/me");
      if (response.data?.username) {
        router.push(`/${response.data.username}`);
      } else {
        console.error("Username not found in API response");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-[#1E1F21]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)]" 
          : "bg-white dark:bg-[#1E1F21] border-b border-gray-200 dark:border-gray-800"
      }`}
    >
      <nav className="max-w-5xl mx-auto flex justify-between items-center py-3 lg:px-0 px-6">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 group"
        >
          <Logo withText size="md" />
        </Link>

        {/* Right Side Navigation */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {!showWriteBtn && (
            <Link 
              href="/write" 
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-customPink dark:hover:text-customPink transition-colors duration-300"
            >
              <WriteBtn />
              <span className="hidden md:inline text-sm font-medium">Write</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Dropdown or Sign In/Sign Up */}
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          ) : session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-customPink transition-all duration-300"
                aria-label="Open user menu"
              >
                <Image
                  src={profilePic || "/images/defaultAvatar.png"}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="object-cover rounded-full"
                  priority
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E1F21] shadow-lg rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 transform origin-top-right transition-all duration-200">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                      Signed in as <span className="font-medium text-gray-900 dark:text-gray-100">{session.user.email}</span>
                    </div>
                    <button
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2B2D] hover:text-customPink transition-colors duration-150"
                      onClick={handleProfileClick}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </button>
                    <button
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2B2D] hover:text-customPink transition-colors duration-150"
                      onClick={() => {
                        router.push("/settings");
                        setIsOpen(false);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2B2D] hover:text-customPink transition-colors duration-150"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2 md:space-x-3">
              <Link
                href="/signup"
                className="bg-customPink text-white px-3 md:px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-700 transition-colors duration-300 flex items-center justify-center"
              >
                Sign Up
              </Link>
              <Link
                href="/signin"
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 px-3 md:px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
