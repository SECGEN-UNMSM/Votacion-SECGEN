import { AsambleistaContextType } from "@/context/AsambleistasContext";
import { useContext } from "react";
import { AsambleistaContext } from "@/context/AsambleistasContext";

export const useAsambleistas = (): AsambleistaContextType => {
  const context = useContext(AsambleistaContext);
  if (!context) {
    throw new Error("UseAsambleistaContext debe de usarse dentro de AsambleistaProvider");
  }
  return context;
};
