import { VotosContextType } from "@/context/VotosContext";
import { useContext } from "react";
import { VotosContext } from "@/context/VotosContext";

export const useVotos = (): VotosContextType => {
  const context = useContext(VotosContext);
  if (!context) {
    throw new Error("UseVotosContext debe de usarse dentro de VotosProvider");
  }
  return context;
};
