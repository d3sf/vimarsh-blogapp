"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { PenTool, Users, BookOpen } from "lucide-react";
import Logo from "../components/Logo";

const SignUpPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        alert("Signup successful! Redirecting to sign in...");
        router.push("/signin");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1E1F21] py-16">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex bg-white dark:bg-[#2A2B2D] shadow-xl rounded-2xl overflow-hidden min-h-[600px]">
          {/* Left side - Landing content */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-customPink to-pink-700 p-12 flex-col justify-center items-center">
            <div className="max-w-sm text-white text-center">
              <div className="mb-8 flex justify-center">
                <Logo size="lg" withText withIcon color="dark" />
              </div>
              <h1 className="text-3xl font-bold mb-6">Join Our Writing Community</h1>
              <p className="text-base mb-8 text-white/90">
                Share your thoughts, connect with readers, and build your audience. Start your writing journey today.
              </p>
              
              <div className="flex justify-center items-center space-x-8">
                <div className="flex flex-col items-center">
                  <PenTool className="w-5 h-5 mb-2" />
                  <h3 className="font-semibold text-sm">Write & Publish</h3>
                </div>
                
                <div className="flex flex-col items-center">
                  <Users className="w-5 h-5 mb-2" />
                  <h3 className="font-semibold text-sm">Connect with Readers</h3>
                </div>
                
                <div className="flex flex-col items-center">
                  <BookOpen className="w-5 h-5 mb-2" />
                  <h3 className="font-semibold text-sm">Discover Content</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Signup form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
            <div className="w-full max-w-sm">
              <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Sign Up</h1>

              {/* Redirect to Sign In */}
              <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-6">
                Already have an account?{" "}
                <Link href="/signin" className="text-customPink hover:underline">
                  Sign in
                </Link>
              </p>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-white dark:bg-[#1E1F21] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-white dark:bg-[#1E1F21] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-white dark:bg-[#1E1F21] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-customPink text-white border border-customPink rounded-md p-2.5 hover:bg-pink-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign up with Email"}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 text-center text-gray-500 dark:text-gray-400">or</div>

              {/* Sign Up with Google */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1E1F21] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#2A2B2D] transition-colors"
              >
                <FcGoogle className="text-xl" />
                Sign up with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
