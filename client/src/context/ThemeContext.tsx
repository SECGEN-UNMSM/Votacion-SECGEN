"use client";

import { createContext, useEffect, useMemo, useState } from "react";

export interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme === "dark" || (storedTheme === null && prefersDark)) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement;
      if (isDark) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDark, mounted]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const valoresContexto = useMemo(() => {
    return {
      isDark,
      toggleDarkMode,
    };
  }, [isDark, toggleDarkMode]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={valoresContexto}>
      {children}
    </ThemeContext.Provider>
  );
};
