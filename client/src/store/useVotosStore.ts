import { create } from "zustand";
import { getRankings, registrarVotos, reiniciarVotos } from "@/api/apiVotos";
import { Ranking, Votos } from "@/lib/types";
import { useAsambleistasStore } from "./useAsambleistasStore";

export interface VotosStore {
  rankingVotos: Ranking[];
  listaVotos: Ranking[];
  loading: boolean;
  agregarVoto: (data: Votos) => Promise<void>;
  reiniciarTodo: () => Promise<void>;
  fetchRankingVotos: () => Promise<void>;
}

export const useVotosStore = create<VotosStore>((set, get) => ({
  rankingVotos: [],
  listaVotos: [],
  loading: true,
  fetchRankingVotos: async () => {
    set({ loading: true });
    try {
      const response = await getRankings();
      set({ 
        rankingVotos: response,
        listaVotos: response.filter((voto) => parseInt(voto.total_votos) > 0)
      });
    } catch (error) {
      console.error("Error al obtener el ranking de votos", error);
    } finally {
      set({ loading: false });
    }
  },
  agregarVoto: async (data: Votos) => {
    try {
      await registrarVotos(data);
      await get().fetchRankingVotos();
      useAsambleistasStore.getState().fetchAsambleistas();
      console.log("Datos enviados correctamente.");
    } catch (error) {
      console.log("Error al agregar el voto.", error);
    }
  },
  reiniciarTodo: async () => {
    try {
      await reiniciarVotos();
      await get().fetchRankingVotos();
      useAsambleistasStore.getState().fetchAsambleistas();
    } catch (error) {
      console.log("Error al reiniciar votos", error);
    }
  }
}));
