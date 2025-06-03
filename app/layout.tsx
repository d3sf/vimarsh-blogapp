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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
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
