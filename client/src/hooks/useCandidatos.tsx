import { CandidatoContextType } from "@/context/CandidatosContext"
import { CandidatoContext } from "@/context/CandidatosContext";
import { useContext } from "react";

export const useCandidatos = (): CandidatoContextType => {
  const context = useContext(CandidatoContext);
  if (!context) {
    throw new Error("useCandidatos se debe de usar dentro de CandidatoProvider")
  }
  return context;
}