import { useCandidatosStore, CandidatoStore } from "@/store/useCandidatosStore";

export const useCandidatos = (): CandidatoStore => {
  return useCandidatosStore();
};