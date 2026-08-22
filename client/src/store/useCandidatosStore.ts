import { create } from 'zustand';
import { getCandidatos } from '@/api/apiCandidato';
import { Candidato } from '@/lib/types';

export interface CandidatoStore {
  candidatos: Candidato[];
  loading: boolean;
  fetchCandidatos: () => Promise<void>;
}

export const useCandidatosStore = create<CandidatoStore>((set) => ({
  candidatos: [],
  loading: true,
  fetchCandidatos: async () => {
    set({ loading: true });
    try {
      const response = await getCandidatos();
      set({ candidatos: response });
    } catch (error) {
      console.error("Error al obtener los candidatos", error);
    } finally {
      set({ loading: false });
    }
  }
}));
