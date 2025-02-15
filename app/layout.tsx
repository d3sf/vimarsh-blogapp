"use client"

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner"; // Import Sonner
import { ThemeProvider } from "./context/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  const pathname = usePathname();
  const hideNavbar = pathname === "/signin" || pathname === "/signup";


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Satoshi-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Satoshi-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Satoshi-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-white dark:bg-[#1E1F21] dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          <SessionProvider>
            {!hideNavbar && <Navbar />} 
            <Toaster position="bottom-center" theme="system" />
            <main className={`${!hideNavbar ? 'pt-16' : ''}`}>
              {children}
            </main>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
