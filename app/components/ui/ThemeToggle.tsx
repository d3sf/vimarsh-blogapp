"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeProvider";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Get the effective theme (considering system preference)
  const effectiveTheme = theme === "system" 
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;

  return (
    <button
      onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center rounded-full p-2 transition-colors "
      aria-label={`Switch to ${effectiveTheme === "dark" ? "light" : "dark"} theme`}
    >
      {effectiveTheme === "dark" ? (
        <SunIcon className="h-5 w-5 text-gray-200" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;   