import { useAsambleistasStore, AsambleistaStore } from "@/store/useAsambleistasStore";

export const useAsambleistas = (): AsambleistaStore => {
  return useAsambleistasStore();
};
