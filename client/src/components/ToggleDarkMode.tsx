import { useDarkMode } from "@/hooks/useDarkMode";
import { Moon, Sun } from "lucide-react";

export function ToggleDarkMode() {
  const [isDark, setIsDark] = useDarkMode();
  
  return (
    <div className="fixed right-4 bottom-4 z-10 p-1 rounded-full flex gap-2 text-green-700 bg-green-800/20 dark:text-stone-200 items-center justify-center" onClick={() => setIsDark(!isDark)}>
      {/*<LaptopMinimal className="rounded-full p-1 text-white cursor-pointer bg-green-700"></LaptopMinimal>*/}
      {
        isDark ? (
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
        )
      }
    </div>
  );
}