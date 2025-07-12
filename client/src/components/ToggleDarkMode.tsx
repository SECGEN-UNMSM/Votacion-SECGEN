import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export function ToggleDarkMode() {
  const { isDark, toggleDarkMode } = useTheme();

  return (
    <button
      className="fixed right-4 bottom-4 z-10 p-1 rounded-full flex gap-2 text-green-700 bg-green-800/20 dark:text-stone-200 items-center justify-center"
      onClick={toggleDarkMode}
    >
      {/*<LaptopMinimal className="rounded-full p-1 text-white cursor-pointer bg-green-700"></LaptopMinimal>*/}
      {isDark ? (
        <Moon
          className={`p-1 cursor-pointer ${
            isDark
              ? "rounded-full p-1 text-white cursor-pointer bg-green-700"
              : ""
          }`}
        ></Moon>
      ) : (
        <Sun
          className={`p-1 cursor-pointer ${
            isDark
              ? ""
              : "rounded-full p-1 text-white cursor-pointer bg-green-700"
          }`}
        ></Sun>
      )}
    </button>
  );
}
