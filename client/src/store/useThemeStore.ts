import { create } from "zustand";

export interface ThemeStore {
  isDark: boolean;
  toggleDarkMode: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDark: false,
  toggleDarkMode: () => {
    const newIsDark = !get().isDark;
    const root = window.document.documentElement;
    if (newIsDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    set({ isDark: newIsDark });
  },
  initTheme: () => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark = storedTheme === "dark" || (storedTheme === null && prefersDark);
    
    if (isDark) {
      window.document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      window.document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    set({ isDark });
  }
}));
