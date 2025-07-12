import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { useContext } from "react";

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe de usarse dentro de ThemeProvider");
  }
  return context;
};
