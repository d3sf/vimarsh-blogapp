"use client";

import { useState, useEffect } from "react";
import { getProviders, signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { BookOpen, PenTool, Users } from "lucide-react";
import Logo from "../components/Logo";

const SignInPage = () => {
    const [providers, setProviders] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
            setIsReady(true);
        };
        fetchProviders();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            console.error("Sign-in error:", result.error);
            alert("Invalid email or password");
        } else {
            window.location.href = "/";
        }
    };

    if (!isReady) return null;

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
                            <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>
                            <p className="text-base mb-8 text-white/90">
                                Continue your writing journey. Share your stories, connect with readers, and grow your audience.
                            </p>
                            
                            <div className="flex justify-center items-center space-x-8">
                                <div className="flex flex-col items-center">
                                    <PenTool className="w-5 h-5 mb-2" />
                                    <h3 className="font-semibold text-sm">Continue Writing</h3>
                                </div>
                                
                                <div className="flex flex-col items-center">
                                    <Users className="w-5 h-5 mb-2" />
                                    <h3 className="font-semibold text-sm">Engage with Community</h3>
                                </div>
                                
                                <div className="flex flex-col items-center">
                                    <BookOpen className="w-5 h-5 mb-2" />
                                    <h3 className="font-semibold text-sm">Discover More</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Signin form */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
                        <div className="w-full max-w-sm">
                            <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Sign in</h1>

                            {/* Redirect to Sign Up */}
                            <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-6">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-customPink hover:underline">
                                    Sign up
                                </Link>
                            </p>

                            {/* Email/Password Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                                >
                                    Sign in with Email
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="my-6 text-center text-gray-500 dark:text-gray-400">or</div>

                            {/* Sign in with Google */}
                            <button
                                onClick={() => signIn("google", { callbackUrl: "/" })}
                                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1E1F21] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#2A2B2D] transition-colors"
                            >
                                <FcGoogle className="text-xl" />
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
