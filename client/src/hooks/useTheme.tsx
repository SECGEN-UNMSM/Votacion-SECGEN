import { useThemeStore, ThemeStore } from "@/store/useThemeStore";

export const useTheme = (): ThemeStore => {
  return useThemeStore();
};
