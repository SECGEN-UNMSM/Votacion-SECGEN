import { AsambleistaContextType } from "@/context/AsambleistaContext";
import { useContext } from "react";
import { AsambleistaContext } from "@/context/AsambleistaContext";

export const useAsambleistas = (): AsambleistaContextType => {
  const context = useContext(AsambleistaContext);
  if (!context) {
    throw new Error("UseAsambleistaContext debe de usarse dentro de AsambleistaProvider");
  }
  return context;
};
