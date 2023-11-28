"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon } from "@heroicons/react/24/outline";
import { MoonIcon } from "@heroicons/react/24/solid";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const renderThemeChanger = () => {
    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        // <SunIcon
        //   className="w-6 h-6 text-yellow-500 "
        //   role="button"
        //   onClick={() => setTheme("light")}
        // />
        <button
          type="button"
          className="relative rounded-full p-1 text-gray-400 hover:text-white"
          onClick={() => setTheme("light")}
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Set theme light</span>
          <SunIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      );
    } else {
      return (
        // <MoonIcon
        //   className="w-6 h-6 text-gray-900 "
        //   role="button"
        //   onClick={() => setTheme("dark")}
        // />
        <button
          type="button"
          className="relative rounded-full p-1 text-gray-800 hover:text-white"
          onClick={() => setTheme("dark")}
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Set theme dark</span>
          <MoonIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      );
    }
  };

  return <>{renderThemeChanger()}</>;
};

export default ThemeSwitcher;
