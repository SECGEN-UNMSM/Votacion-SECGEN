import { create } from 'zustand';
import { getAsambleistas } from '@/api/apiAsambleista';
import { Asambleista } from '@/lib/types';

export interface AsambleistaStore {
  asambleistas: Asambleista[];
  loading: boolean;
  fetchAsambleistas: () => Promise<void>;
}

export const useAsambleistasStore = create<AsambleistaStore>((set) => ({
  asambleistas: [],
  loading: true,
  fetchAsambleistas: async () => {
    set({ loading: true });
    try {
      const response = await getAsambleistas();
      set({ asambleistas: response });
    } catch (error) {
      console.log("Error al obtener los asambleistas", error);
    } finally {
      set({ loading: false });
    }
  }
}));
