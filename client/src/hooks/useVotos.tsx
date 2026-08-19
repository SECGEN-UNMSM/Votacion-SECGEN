import { useVotosStore, VotosStore } from "@/store/useVotosStore";

export const useVotos = (): VotosStore => {
  return useVotosStore();
};
